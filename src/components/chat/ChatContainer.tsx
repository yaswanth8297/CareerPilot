"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Send, Sparkles, User, RefreshCw, FileText, Compass, Briefcase, Award, ArrowRight, CheckCircle2, Globe } from "lucide-react";
import {
  ChatMessage,
  StudentProfile,
  ActionChip,
  LanguagePref,
  ResumeAnalysisResult,
  RoadmapData,
  JobListing,
  InterviewReport
} from "@/lib/types";
import {
  OPENING_MESSAGE_HINGLISH,
  OPENING_MESSAGE_ENGLISH,
  INITIAL_CHIPS_HINGLISH,
  INITIAL_CHIPS_ENGLISH,
  BRANCH_CHIPS,
  getYearChips,
  getSkillChips,
  getGoalChips,
  getMainFeatureChips,
  getInitialChips,
  getRecommendedRolesForStudent,
  generateSeniorBhaiyaReply,
  CHAT_STRINGS
} from "@/lib/ai/chatBotEngine";
import { analyzeResumeContent } from "@/lib/ai/resumeAnalyzer";
import { generatePersonalizedRoadmap } from "@/lib/ai/roadmapGenerator";
import { filterAndRankJobs } from "@/lib/data/demoJobs";
import { getInitialState, saveState, logAnalytics, getStoredLanguage, setStoredLanguage } from "@/lib/storage/mockDb";

import ResumeCheckCard from "./ResumeCheckCard";
import RoadmapCard from "./RoadmapCard";
import JobsCard from "./JobsCard";
import ResumeUploadModal from "./ResumeUploadModal";
import MockInterviewModal from "./MockInterviewModal";
import RegistrationModal from "@/components/modals/RegistrationModal";

export default function ChatContainer({
  isEmbedded = false,
  language = "hinglish"
}: {
  isEmbedded?: boolean;
  language?: LanguagePref;
}) {
  const [activeLanguage, setActiveLanguage] = useState<LanguagePref>(language);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Active onboarding step
  // null = opened, "branch" = step 1, "year" = step 2, "skills" = step 3, "goal" = step 4, "done" = onboarded
  const [onboardingStep, setOnboardingStep] = useState<string | null>(null);
  const [tempSkills, setTempSkills] = useState<string[]>([]);

  // Modals state
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  // Cached feature data
  const [resumeResult, setResumeResult] = useState<ResumeAnalysisResult | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<JobListing[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef<LanguagePref>(language);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // Sync active language from props and stored preferences
  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored) {
      setActiveLanguage(stored);
    } else if (language) {
      setActiveLanguage(language);
    }
  }, [language]);

  // Listen to language changes broadcasted by Navbar or other components
  useEffect(() => {
    const handleLangChange = (e: any) => {
      const newLang = e.detail as LanguagePref;
      if (newLang && newLang !== activeLanguage) {
        handleLanguageSwitch(newLang);
      }
    };
    window.addEventListener("careerpilot_language_changed", handleLangChange);
    return () => window.removeEventListener("careerpilot_language_changed", handleLangChange);
  }, [activeLanguage, messages]);

  // Initialize or load state
  useEffect(() => {
    const st = getInitialState();
    setSessionId(st.sessionId);
    setIsRegistered(st.isRegistered);
    if (st.profile) {
      setProfile(st.profile);
      if (st.profile.languagePref) {
        setActiveLanguage(st.profile.languagePref);
      }
    }
    if (st.currentResumeResult) setResumeResult(st.currentResumeResult);
    if (st.roadmap) setRoadmapData(st.roadmap);

    if (st.messages && st.messages.length > 0) {
      setMessages(st.messages);
      if (st.profile) setOnboardingStep("done");
    } else {
      // First visit: send opening message matching the active language
      const strings = CHAT_STRINGS[activeLanguage] || CHAT_STRINGS.hinglish;
      const welcomeMsg: ChatMessage = {
        id: "msg_welcome",
        sender: "bot",
        text: strings.welcome,
        timestamp: new Date().toISOString(),
        chips: strings.initialChips
      };
      setMessages([welcomeMsg]);
      logAnalytics("chat_widget_opened", { language: activeLanguage });
    }
  }, []);

  // Handle Dynamic Language Switching in Chat
  const handleLanguageSwitch = (newLang: LanguagePref) => {
    setActiveLanguage(newLang);
    setStoredLanguage(newLang);

    if (profile) {
      setProfile(prev => (prev ? { ...prev, languagePref: newLang } : null));
    }

    const strings = CHAT_STRINGS[newLang];

    // If chat is only at the opening message, translate it in place
    if (messages.length <= 1) {
      const updatedWelcome: ChatMessage = {
        id: "msg_welcome",
        sender: "bot",
        text: strings.welcome,
        timestamp: new Date().toISOString(),
        chips: strings.initialChips
      };
      setMessages([updatedWelcome]);
      const st = getInitialState();
      st.messages = [updatedWelcome];
      saveState(st);
      return;
    }

    // If conversation is already underway, add a prompt acknowledging the switch
    addBotMessage(strings.languageSwitched, getMainFeatureChips(newLang));
  };

  const toggleLanguage = () => {
    const nextLang = activeLanguage === "hinglish" ? "en" : "hinglish";
    handleLanguageSwitch(nextLang);
  };

  const addBotMessage = (text: string, chips?: ActionChip[], cardPayload?: any) => {
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      const botMsg: ChatMessage = {
        id: "bot_" + Math.random().toString(36).substring(2, 9),
        sender: "bot",
        text,
        timestamp: new Date().toISOString(),
        chips,
        cardPayload
      };
      setMessages(prev => {
        const next = [...prev, botMsg];
        const st = getInitialState();
        st.messages = next;
        saveState(st);
        return next;
      });
    }, 380);
  };

  const addUserMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      sender: "user",
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => {
      const next = [...prev, userMsg];
      const st = getInitialState();
      st.messages = next;
      saveState(st);
      return next;
    });
  };

  // Trigger celebratory confetti on value moments
  const fireValueConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}
  };

  // Handle Action Chip or Quick Reply Click
  const handleChipClick = (chip: ActionChip) => {
    addUserMessage(chip.label);
    const strings = CHAT_STRINGS[activeLanguage];

    // Initial greeting response
    if (chip.value === "ready" || chip.value === "tell_more") {
      logAnalytics("onboarding_step_viewed", { step: 1 });
      setOnboardingStep("branch");
      addBotMessage(strings.askBranch, BRANCH_CHIPS);
      return;
    }

    // Step 1: Branch chosen
    if (onboardingStep === "branch") {
      const selectedBranch = chip.value;
      const initialProf: StudentProfile = {
        sessionId,
        branch: selectedBranch,
        year: "3",
        skills: [],
        careerGoal: "",
        targetRole: "software-developer",
        languagePref: activeLanguage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProfile(initialProf);
      setOnboardingStep("year");
      logAnalytics("onboarding_step_completed", { step: 1, branch: selectedBranch });

      addBotMessage(strings.askYear, getYearChips(activeLanguage));
      return;
    }

    // Step 2: Year chosen
    if (onboardingStep === "year") {
      const selectedYear = chip.value.replace("-en", "") as any;
      if (profile) {
        setProfile({ ...profile, year: selectedYear });
      }
      setOnboardingStep("skills");
      logAnalytics("onboarding_step_completed", { step: 2, year: selectedYear });

      addBotMessage(strings.askSkills, getSkillChips(activeLanguage));
      return;
    }

    // Step 3: Skills chosen
    if (onboardingStep === "skills") {
      if (chip.value === "done_skills") {
        const finalSkills = tempSkills.length > 0 ? tempSkills : ["Basics"];
        if (profile) {
          setProfile({ ...profile, skills: finalSkills });
        }
        setOnboardingStep("goal");
        logAnalytics("onboarding_step_completed", { step: 3, skillsCount: finalSkills.length });

        addBotMessage(strings.askGoal, getGoalChips(activeLanguage));
        return;
      } else {
        // Toggle skill
        const skillName = chip.value.replace("-en", "");
        const nextSkills = tempSkills.includes(skillName)
          ? tempSkills.filter(s => s !== skillName)
          : [...tempSkills, skillName];
        setTempSkills(nextSkills);

        addBotMessage(
          strings.skillAdded(skillName, nextSkills.length),
          getSkillChips(activeLanguage)
        );
        return;
      }
    }

    // Step 4: Career Goal chosen
    if (onboardingStep === "goal") {
      if (chip.value === "not_sure") {
        // AI recommends 2-3 roles from branch & skills
        const recommended = getRecommendedRolesForStudent(profile?.branch || "CSE", tempSkills, activeLanguage);
        addBotMessage(strings.recommendRolesPrompt, recommended);
        return;
      }

      const chosenRoleKey = chip.value.replace("-en", "");
      const completeProfile: StudentProfile = {
        ...(profile || {
          sessionId,
          branch: "CSE",
          year: "3",
          skills: tempSkills,
          languagePref: activeLanguage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          careerGoal: chosenRoleKey,
          targetRole: chosenRoleKey
        }),
        careerGoal: chosenRoleKey,
        targetRole: chosenRoleKey,
        skills: tempSkills.length > 0 ? tempSkills : ["Basics", "Problem Solving"],
        languagePref: activeLanguage
      };

      setProfile(completeProfile);
      setOnboardingStep("done");

      // Save to local storage
      const st = getInitialState();
      st.profile = completeProfile;
      saveState(st);
      logAnalytics("profile_created", { role: chosenRoleKey });
      fireValueConfetti();

      // Show Profile Summary Card and offer 4 main features per PRD
      addBotMessage(
        strings.profileCreated,
        getMainFeatureChips(activeLanguage),
        {
          type: "onboarding_summary",
          data: completeProfile
        }
      );
      return;
    }

    // Feature selection triggers
    if (chip.value === "feature_resume") {
      logAnalytics("feature_selected", { feature: "resume_check" });
      setIsResumeModalOpen(true);
    } else if (chip.value === "feature_roadmap") {
      logAnalytics("feature_selected", { feature: "roadmap" });
      handleTriggerRoadmap();
    } else if (chip.value === "feature_jobs") {
      logAnalytics("feature_selected", { feature: "jobs" });
      handleTriggerJobs();
    } else if (chip.value === "feature_interview") {
      logAnalytics("feature_selected", { feature: "mock_interview" });
      if (!isRegistered) {
        setIsRegModalOpen(true);
      } else {
        setIsInterviewModalOpen(true);
      }
    }
  };

  // Handle Free Text Input with Intelligent Senior Bhaiya Responder
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText("");
    addUserMessage(text);
    const strings = CHAT_STRINGS[activeLanguage];

    // Contextual handling if during onboarding
    if (onboardingStep === "branch") {
      const prof: StudentProfile = {
        sessionId,
        branch: text,
        year: "3",
        skills: [],
        careerGoal: "",
        targetRole: "software-developer",
        languagePref: activeLanguage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProfile(prof);
      setOnboardingStep("year");
      addBotMessage(
        activeLanguage === "en" ? `Noted branch: ${text}! Which year are you in?` : `Noted branch: ${text}! Ab batao kaunse year mein padh rahe ho?`,
        getYearChips(activeLanguage)
      );
      return;
    }

    if (onboardingStep === "skills") {
      const skillsParsed = text.split(/[,/ ]+/).filter(Boolean);
      const combined = [...tempSkills, ...skillsParsed];
      setTempSkills(combined);
      addBotMessage(
        activeLanguage === "en"
          ? `Great! Skills saved: ${combined.join(", ")}. Now choose your career target role:`
          : `Badhiya! Skills noted: ${combined.join(", ")}. Ab target role choose karein?`,
        getGoalChips(activeLanguage)
      );
      setOnboardingStep("goal");
      return;
    }

    // Intelligent Senior Bhaiya Dialog & Intent Responder
    const aiResponse = generateSeniorBhaiyaReply(text, profile, activeLanguage);

    // If query was asking to change language, update active language state
    if (aiResponse.detectedLanguageChange && aiResponse.detectedLanguageChange !== activeLanguage) {
      setActiveLanguage(aiResponse.detectedLanguageChange);
      setStoredLanguage(aiResponse.detectedLanguageChange);
    }

    addBotMessage(aiResponse.text, aiResponse.chips);
  };

  // Feature Trigger: Roadmap
  const handleTriggerRoadmap = () => {
    const roleKey = profile?.targetRole || "software-developer";
    const strings = CHAT_STRINGS[activeLanguage];
    const rMap = generatePersonalizedRoadmap({
      targetRoleKey: roleKey,
      userSkills: profile?.skills || [],
      year: profile?.year || "3",
      isRegistered
    });
    setRoadmapData(rMap);

    const st = getInitialState();
    st.roadmap = rMap;
    saveState(st);

    fireValueConfetti();
    logAnalytics("roadmap_preview_viewed", { role: roleKey });

    addBotMessage(
      strings.roadmapReady,
      [
        { id: "c-unlock-rm", label: strings.unlockFullRoadmapChip, value: "open_reg" },
        { id: "c-check-jobs", label: strings.checkJobsChip, value: "feature_jobs" }
      ],
      {
        type: "roadmap_preview",
        data: rMap
      }
    );
  };

  // Feature Trigger: Jobs
  const handleTriggerJobs = () => {
    const jobs = filterAndRankJobs({
      targetRole: profile?.targetRole,
      userSkills: profile?.skills || []
    });
    setMatchedJobs(jobs);
    const strings = CHAT_STRINGS[activeLanguage];

    logAnalytics("job_preview_viewed", { jobsCount: jobs.length });

    addBotMessage(
      strings.jobsReady,
      [
        { id: "c-interview-go", label: strings.practiceInterviewChip, value: "feature_interview" },
        { id: "c-resume-go", label: strings.checkResumeChip, value: "feature_resume" }
      ],
      {
        type: "jobs_preview",
        data: jobs
      }
    );
  };

  // Feature Trigger: Resume Analyzed
  const handleResumeAnalyzed = (rawText: string, fileName?: string) => {
    logAnalytics("resume_upload_started");
    const roleKey = profile?.targetRole || "software-developer";
    const strings = CHAT_STRINGS[activeLanguage];
    const result = analyzeResumeContent({
      resumeText: rawText,
      targetRole: roleKey,
      isRegistered,
      featureFlagLockMistakes: true
    });
    setResumeResult(result);

    const st = getInitialState();
    st.currentResumeResult = result;
    st.resumeHistory.push(result);
    saveState(st);

    fireValueConfetti();
    logAnalytics("resume_score_viewed", { score: result.score });

    addBotMessage(
      strings.resumeReviewed(result.score),
      [
        { id: "c-unlock-fixes", label: strings.unlockFixesChip, value: "open_reg" },
        { id: "c-rm-go", label: strings.seeRoadmapChip, value: "feature_roadmap" }
      ],
      {
        type: "resume_preview",
        data: result
      }
    );

    // Soft registration prompt after value moment lands per PRD
    if (!isRegistered) {
      setTimeout(() => {
        addBotMessage(
          strings.softRegistrationPrompt,
          [{ id: "c-save-prog", label: strings.saveProgressChip, value: "open_reg" }]
        );
      }, 1500);
    }
  };

  // Handle roadmap task toggle
  const handleToggleRoadmapTask = (weekNumber: number, taskId: string) => {
    if (!roadmapData) return;
    const updatedWeeks = roadmapData.weeks.map(w => {
      if (w.weekNumber === weekNumber) {
        return {
          ...w,
          tasks: w.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      }
      return w;
    });

    const updatedRoadmap = { ...roadmapData, weeks: updatedWeeks };
    setRoadmapData(updatedRoadmap);

    const st = getInitialState();
    st.roadmap = updatedRoadmap;
    saveState(st);
  };

  // Re-run registration unlock
  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    fireValueConfetti();
    const strings = CHAT_STRINGS[activeLanguage];

    // Unlock roadmap weeks and resume mistakes
    if (roadmapData) {
      const unlocked = {
        ...roadmapData,
        weeks: roadmapData.weeks.map(w => ({ ...w, isLocked: false }))
      };
      setRoadmapData(unlocked);
    }

    if (resumeResult) {
      const unlockedResume = {
        ...resumeResult,
        mistakes: resumeResult.mistakes.map(m => ({ ...m, isLocked: false }))
      };
      setResumeResult(unlockedResume);
    }

    addBotMessage(
      strings.registrationSuccess,
      getMainFeatureChips(activeLanguage)
    );
  };

  return (
    <div
      className={`flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors ${
        isEmbedded ? "h-full w-full" : "h-[calc(100vh-4rem)] max-w-4xl mx-auto border-x border-zinc-200 dark:border-zinc-800 shadow-xl"
      }`}
    >
      {/* Active Student Mini Banner with In-Chat Language Toggle */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-zinc-600 dark:text-zinc-400">
            {profile ? (
              <>
                <strong>{profile.branch}</strong> ({profile.year} Year) • Target: <strong>{profile.targetRole}</strong>
              </>
            ) : (
              <span>Senior Bhaiya / Didi Online 👋</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* In-Chat Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-1.5 shadow-sm"
            title="Toggle between English and Hinglish"
          >
            <Globe className="w-3 h-3 text-orange-500" />
            <span>{activeLanguage === "en" ? "🇬🇧 English" : "🇮🇳 Hinglish"}</span>
          </button>

          {profile && (
            <button
              onClick={() => {
                setOnboardingStep("branch");
                addBotMessage(CHAT_STRINGS[activeLanguage].editProfilePrompt, BRANCH_CHIPS);
              }}
              className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-semibold"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} animate-in fade-in`}
          >
            {/* Sender Badge */}
            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-zinc-400 font-medium">
              {msg.sender === "bot" ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-[10px]">
                    B
                  </div>
                  <span>Senior Bhaiya / Didi</span>
                </>
              ) : (
                <>
                  <span>You</span>
                  <div className="w-5 h-5 rounded-full bg-zinc-700 text-white flex items-center justify-center text-[10px]">
                    U
                  </div>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl max-w-[88%] sm:max-w-[80%] text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none font-medium"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>

            {/* Embedded Cards Payload */}
            {msg.cardPayload && (
              <div className="w-full mt-2">
                {msg.cardPayload.type === "onboarding_summary" && (
                  <div className="w-full max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-orange-950/30 border border-orange-200 dark:border-orange-900/40 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>{activeLanguage === "en" ? "Your Profile Summary:" : "Ye hai tera profile card:"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-zinc-700 dark:text-zinc-300">
                      <div>
                        Branch: <strong>{msg.cardPayload.data.branch}</strong>
                      </div>
                      <div>
                        Year: <strong>{msg.cardPayload.data.year} Year</strong>
                      </div>
                      <div>
                        Target Role: <strong>{msg.cardPayload.data.targetRole}</strong>
                      </div>
                      <div>
                        Skills: <strong>{msg.cardPayload.data.skills?.join(", ") || "Basics"}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {msg.cardPayload.type === "resume_preview" && (
                  <ResumeCheckCard
                    result={msg.cardPayload.data}
                    onUnlockMistakes={() => setIsRegModalOpen(true)}
                    onReupload={() => setIsResumeModalOpen(true)}
                  />
                )}

                {msg.cardPayload.type === "roadmap_preview" && (
                  <RoadmapCard
                    roadmap={msg.cardPayload.data}
                    onToggleTask={handleToggleRoadmapTask}
                    onUnlockRoadmap={() => setIsRegModalOpen(true)}
                  />
                )}

                {msg.cardPayload.type === "jobs_preview" && (
                  <JobsCard
                    jobs={msg.cardPayload.data}
                    isGuest={!isRegistered}
                    onUnlockAllJobs={() => setIsRegModalOpen(true)}
                  />
                )}
              </div>
            )}

            {/* Quick-reply Action Chips */}
            {msg.chips && msg.chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-full">
                {msg.chips.map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      if (chip.value === "open_reg") {
                        setIsRegModalOpen(true);
                      } else {
                        handleChipClick(chip);
                      }
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 shadow-sm transition-all flex items-center gap-1 active:scale-95"
                  >
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Bot Typing Indicator */}
        {isBotTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-fit">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce delay-150" />
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce delay-300" />
            <span className="text-xs text-zinc-400 font-medium ml-1">
              {activeLanguage === "en" ? "Senior mentor typing..." : "Senior bhaiya typing..."}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Quick Upload Icon Shortcut */}
          <button
            type="button"
            onClick={() => setIsResumeModalOpen(true)}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 hover:text-orange-600 hover:border-orange-400 transition-colors"
            title="Upload or Paste Resume"
          >
            <FileText className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={
              activeLanguage === "en"
                ? "Type any career question or reply freely..."
                : "Type your reply or question freely..."
            }
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-zinc-900 dark:text-white"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Modals */}
      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSubmitResume={handleResumeAnalyzed}
      />

      <MockInterviewModal
        roleId={profile?.targetRole || "software-developer"}
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onComplete={report => {
          const st = getInitialState();
          st.interviewHistory.push(report);
          saveState(st);
          logAnalytics("mock_interview_completed", { score: report.overallScore });
          fireValueConfetti();
        }}
      />

      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
