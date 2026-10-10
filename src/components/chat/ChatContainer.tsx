"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Send, Sparkles, User, RefreshCw, FileText, Compass, Briefcase, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  ChatMessage,
  StudentProfile,
  ActionChip,
  ResumeAnalysisResult,
  RoadmapData,
  JobListing,
  InterviewReport
} from "@/lib/types";
import {
  OPENING_MESSAGE,
  INITIAL_CHIPS,
  BRANCH_CHIPS,
  getYearChips,
  getSkillChips,
  getGoalChips,
  getMainFeatureChips,
  getRecommendedRolesForStudent,
  generateCareerGuideReply,
  CHAT_STRINGS
} from "@/lib/ai/chatBotEngine";
import { analyzeResumeContent } from "@/lib/ai/resumeAnalyzer";
import { generatePersonalizedRoadmap } from "@/lib/ai/roadmapGenerator";
import { filterAndRankJobs } from "@/lib/data/demoJobs";
import { getInitialState, saveState, logAnalytics } from "@/lib/storage/mockDb";

import ResumeCheckCard from "./ResumeCheckCard";
import RoadmapCard from "./RoadmapCard";
import JobsCard from "./JobsCard";
import ResumeUploadModal from "./ResumeUploadModal";
import MockInterviewModal from "./MockInterviewModal";
import RegistrationModal from "@/components/modals/RegistrationModal";

export type FeatureIntent = "resume_check" | "roadmap" | "jobs" | "mock_interview";

export function normalizeIntent(raw?: string | null): FeatureIntent | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  if (lower.includes("resume") || lower === "feature_resume") return "resume_check";
  if (lower.includes("roadmap") || lower === "feature_roadmap") return "roadmap";
  if (lower.includes("job") || lower === "feature_jobs") return "jobs";
  if (lower.includes("interview") || lower.includes("mock") || lower === "feature_interview") return "mock_interview";
  return null;
}

function getIntentGreeting(intent: FeatureIntent): string {
  switch (intent) {
    case "resume_check":
      return "Ready to check your resume? 📄 Let's quickly build your profile in 30 seconds first so I can analyze it against your target role. Which college branch are you in?";
    case "roadmap":
      return "Ready for your 90-Day Roadmap? 🗺️ Let's quickly build your profile in 30 seconds first so we can map out your tailored weekly plan. Which college branch are you in?";
    case "jobs":
      return "Looking for curated, scam-free job matches? 💼 Let's quickly build your profile in 30 seconds first so I can match you with verified openings. Which college branch are you in?";
    case "mock_interview":
      return "Ready for your 5-Min Mock Interview? 🎯 Let's quickly build your profile in 30 seconds first so I can tailor the questions to your stream. Which college branch are you in?";
  }
}

export default function ChatContainer({
  isEmbedded = false,
  initialIntent
}: {
  isEmbedded?: boolean;
  initialIntent?: string | null;
}) {
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

  // Queued feature intent when arriving from landing page cards
  const [pendingIntent, setPendingIntent] = useState<FeatureIntent | null>(null);
  const [activeIntent, setActiveIntent] = useState<string | null>(initialIntent || null);
  const lastHandledIntentRef = useRef<string | null>(null);

  // Feature modals and state
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const [resumeResult, setResumeResult] = useState<ResumeAnalysisResult | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<JobListing[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // Sync activeIntent from prop or client URL parameter
  useEffect(() => {
    if (initialIntent) {
      setActiveIntent(initialIntent);
    } else if (typeof window !== "undefined") {
      const urlIntent = new URLSearchParams(window.location.search).get("intent");
      if (urlIntent) {
        setActiveIntent(urlIntent);
      }
    }
  }, [initialIntent]);

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
    }, 450);
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

  const fireValueConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch (e) {}
  };

  // Feature Trigger: Roadmap
  const handleTriggerRoadmap = (overrideProfile?: StudentProfile | null) => {
    const activeProf = overrideProfile || profile || getInitialState().profile;
    const roleKey = activeProf?.targetRole || "software-developer";
    const strings = CHAT_STRINGS;
    const rMap = generatePersonalizedRoadmap({
      targetRoleKey: roleKey,
      userSkills: activeProf?.skills || [],
      year: activeProf?.year || "3",
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
        { id: "c-jobs", label: strings.checkJobsChip, value: "feature_jobs" }
      ],
      {
        type: "roadmap_preview",
        data: rMap
      }
    );
  };

  // Feature Trigger: Jobs
  const handleTriggerJobs = (overrideProfile?: StudentProfile | null) => {
    const activeProf = overrideProfile || profile || getInitialState().profile;
    const roleKey = activeProf?.targetRole || "software-developer";
    const userSkills = activeProf?.skills || ["JavaScript", "Python", "SQL"];
    const strings = CHAT_STRINGS;

    const ranked = filterAndRankJobs({
      targetRole: roleKey,
      userSkills
    });
    setMatchedJobs(ranked);

    const st = getInitialState();
    st.savedJobs = ranked.slice(0, 5);
    saveState(st);

    logAnalytics("job_preview_viewed", { count: ranked.length, role: roleKey });

    addBotMessage(
      strings.jobsReady,
      [
        { id: "c-apply", label: "📄 Improve Resume ATS For These Jobs", value: "feature_resume" },
        { id: "c-rm", label: strings.seeRoadmapChip, value: "feature_roadmap" }
      ],
      {
        type: "jobs_preview",
        data: ranked.slice(0, 4)
      }
    );
  };

  // Immediate feature trigger when user already has a completed profile
  const handleExecuteIntentForProfile = (intent: FeatureIntent, activeProfile: StudentProfile) => {
    if (intent === "resume_check") {
      logAnalytics("feature_selected", { feature: "resume_check" });
      addBotMessage(
        "Welcome back! Ready to check your ATS resume? 📄 Upload your PDF or paste your resume text to get your 100-point score breakdown & 3 key fixes.",
        [
          { id: "c-open-resume", label: "Upload Resume 📄", value: "feature_resume" },
          ...getMainFeatureChips()
        ]
      );
      setTimeout(() => setIsResumeModalOpen(true), 400);
    } else if (intent === "roadmap") {
      logAnalytics("feature_selected", { feature: "roadmap" });
      addBotMessage(
        `Generating your personalized 90-Day Placement Roadmap for ${activeProfile.targetRole || "your target role"}... 🗺️`
      );
      setTimeout(() => handleTriggerRoadmap(activeProfile), 400);
    } else if (intent === "jobs") {
      logAnalytics("feature_selected", { feature: "jobs" });
      addBotMessage(
        "Finding verified fresher jobs and scam-free matches based on your skills... 💼"
      );
      setTimeout(() => handleTriggerJobs(activeProfile), 400);
    } else if (intent === "mock_interview") {
      logAnalytics("feature_selected", { feature: "mock_interview" });
      addBotMessage(
        "Preparing your 5-Minute Mock Interview session with fresher-tuned questions... 🎯"
      );
      setTimeout(() => {
        const currSt = getInitialState();
        if (!currSt.isRegistered) {
          setIsRegModalOpen(true);
        } else {
          setIsInterviewModalOpen(true);
        }
      }, 400);
    }
  };

  // Initialize or load state with intent awareness
  useEffect(() => {
    const st = getInitialState();
    setSessionId(st.sessionId);
    setIsRegistered(st.isRegistered);
    if (st.profile) {
      setProfile(st.profile);
    }
    if (st.currentResumeResult) setResumeResult(st.currentResumeResult);
    if (st.roadmap) setRoadmapData(st.roadmap);

    const normIntent = normalizeIntent(activeIntent);

    if (st.profile) {
      setOnboardingStep("done");
      if (st.messages && st.messages.length > 0) {
        setMessages(st.messages);
      }
      if (normIntent && lastHandledIntentRef.current !== normIntent) {
        lastHandledIntentRef.current = normIntent;
        handleExecuteIntentForProfile(normIntent, st.profile);
      }
    } else {
      // Guest / Anonymous student without profile
      if (normIntent && lastHandledIntentRef.current !== normIntent) {
        lastHandledIntentRef.current = normIntent;
        setPendingIntent(normIntent);
        setOnboardingStep("branch");

        const intentGreeting = getIntentGreeting(normIntent);
        const welcomeMsg: ChatMessage = {
          id: "msg_welcome_intent",
          sender: "bot",
          text: intentGreeting,
          timestamp: new Date().toISOString(),
          chips: BRANCH_CHIPS
        };
        setMessages(prev => (prev.length > 0 ? [...prev, welcomeMsg] : [welcomeMsg]));
        logAnalytics("chat_widget_opened", { language: "en", intent: normIntent });
      } else if (st.messages && st.messages.length > 0) {
        setMessages(st.messages);
      } else {
        // First visit: send welcoming English greeting
        const welcomeMsg: ChatMessage = {
          id: "msg_welcome",
          sender: "bot",
          text: OPENING_MESSAGE,
          timestamp: new Date().toISOString(),
          chips: INITIAL_CHIPS
        };
        setMessages([welcomeMsg]);
        logAnalytics("chat_widget_opened", { language: "en" });
      }
    }
  }, [activeIntent]);

  // Handle Quick Reply Chip Click
  const handleChipClick = (chip: ActionChip) => {
    addUserMessage(chip.label);
    const strings = CHAT_STRINGS;

    // Opening greeting click
    if (chip.value === "ready") {
      logAnalytics("chat_started");
      setOnboardingStep("branch");
      logAnalytics("onboarding_step_viewed", { step: 1 });
      addBotMessage(strings.askBranch, BRANCH_CHIPS);
      return;
    }

    if (chip.value === "tell_more") {
      addBotMessage(
        "CareerPilot AI delivers instant career clarity:\n1. ATS Resume Score & 3 key fixes\n2. 90-Day Roadmap with vetted free resources\n3. Skill-matched Jobs with scam protection\n4. 5-Min Mock Interview with score breakdown.\n\nReady to get started?",
        INITIAL_CHIPS
      );
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProfile(initialProf);
      setOnboardingStep("year");
      logAnalytics("onboarding_step_completed", { step: 1, branch: selectedBranch });

      addBotMessage(strings.askYear, getYearChips());
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

      addBotMessage(strings.askSkills, getSkillChips());
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

        addBotMessage(strings.askGoal, getGoalChips());
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
          getSkillChips()
        );
        return;
      }
    }

    // Step 4: Career Goal chosen
    if (onboardingStep === "goal") {
      if (chip.value === "not_sure") {
        // AI recommends 2-3 roles from branch & skills
        const recommended = getRecommendedRolesForStudent(profile?.branch || "CSE", tempSkills);
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          careerGoal: chosenRoleKey,
          targetRole: chosenRoleKey
        }),
        careerGoal: chosenRoleKey,
        targetRole: chosenRoleKey,
        skills: tempSkills.length > 0 ? tempSkills : ["Basics", "Problem Solving"]
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
      if (pendingIntent) {
        const intentToRun = pendingIntent;
        setPendingIntent(null);

        addBotMessage(
          `${strings.profileCreated}\n\nLaunching your selected preview now! 🚀`,
          getMainFeatureChips(),
          {
            type: "onboarding_summary",
            data: completeProfile
          }
        );

        setTimeout(() => {
          if (intentToRun === "resume_check") {
            logAnalytics("feature_selected", { feature: "resume_check" });
            setIsResumeModalOpen(true);
          } else if (intentToRun === "roadmap") {
            logAnalytics("feature_selected", { feature: "roadmap" });
            handleTriggerRoadmap(completeProfile);
          } else if (intentToRun === "jobs") {
            logAnalytics("feature_selected", { feature: "jobs" });
            handleTriggerJobs(completeProfile);
          } else if (intentToRun === "mock_interview") {
            logAnalytics("feature_selected", { feature: "mock_interview" });
            const currSt = getInitialState();
            if (!currSt.isRegistered) {
              setIsRegModalOpen(true);
            } else {
              setIsInterviewModalOpen(true);
            }
          }
        }, 600);
        return;
      }

      addBotMessage(
        strings.profileCreated,
        getMainFeatureChips(),
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

  // Handle Free Text Input with Personal Career Guide Responder
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText("");
    addUserMessage(text);
    const strings = CHAT_STRINGS;

    // Contextual handling if during onboarding
    if (onboardingStep === "branch") {
      const prof: StudentProfile = {
        sessionId,
        branch: text,
        year: "3",
        skills: [],
        careerGoal: "",
        targetRole: "software-developer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProfile(prof);
      setOnboardingStep("year");
      addBotMessage(
        `Noted branch: ${text}! Which year of college are you in?`,
        getYearChips()
      );
      return;
    }

    if (onboardingStep === "skills") {
      const skillsParsed = text.split(/[,/ ]+/).filter(Boolean);
      const combined = [...tempSkills, ...skillsParsed];
      setTempSkills(combined);
      addBotMessage(
        `Great! Skills saved: ${combined.join(", ")}. Now choose your career target role:`,
        getGoalChips()
      );
      setOnboardingStep("goal");
      return;
    }

    // Intelligent Career Guide Dialog & Intent Responder
    const aiResponse = generateCareerGuideReply(text, profile);
    addBotMessage(aiResponse.text, aiResponse.chips);
  };

  // Resume Upload Callback
  const handleSubmitResume = (text: string) => {
    setIsResumeModalOpen(false);
    const audited = analyzeResumeContent({
      resumeText: text,
      targetRole: profile?.targetRole || "software-developer",
      isRegistered
    });
    handleResumeAudited(audited);
  };

  const handleResumeAudited = (result: ResumeAnalysisResult) => {
    setIsResumeModalOpen(false);
    setResumeResult(result);

    const strings = CHAT_STRINGS;
    const st = getInitialState();
    st.currentResumeResult = result;
    st.resumeHistory = [result, ...(st.resumeHistory || [])];
    saveState(st);

    fireValueConfetti();
    logAnalytics("resume_score_viewed", { score: result.score });

    addBotMessage(
      strings.resumeReviewed(result.score),
      [
        { id: "c-unlock-fixes", label: strings.unlockFixesChip, value: "open_reg" },
        { id: "c-rm", label: strings.seeRoadmapChip, value: "feature_roadmap" },
        { id: "c-interview", label: strings.practiceInterviewChip, value: "feature_interview" }
      ],
      {
        type: "resume_preview",
        data: result
      }
    );
  };

  // Mock Interview Completion Callback
  const handleInterviewCompleted = (report: InterviewReport) => {
    setIsInterviewModalOpen(false);
    const strings = CHAT_STRINGS;

    const st = getInitialState();
    st.interviewHistory = [report, ...(st.interviewHistory || [])];
    saveState(st);

    fireValueConfetti();
    logAnalytics("mock_interview_completed", { score: report.overallScore });

    addBotMessage(
      `Great mock interview session! Your overall score is ${report.overallScore}/10.\nTop strength: "${report.strengths[0]}". Full feedback report saved to your dashboard.`,
      [
        { id: "c-dash", label: "📊 Open My Space Dashboard", value: "go_dashboard" },
        { id: "c-rm", label: strings.seeRoadmapChip, value: "feature_roadmap" },
        { id: "c-jobs", label: strings.checkJobsChip, value: "feature_jobs" }
      ],
      {
        type: "interview_invite",
        data: report
      }
    );
  };

  // Registration Callback
  const handleRegistrationCompleted = () => {
    setIsRegModalOpen(false);
    setIsRegistered(true);

    const strings = CHAT_STRINGS;
    fireValueConfetti();
    logAnalytics("registration_completed");

    // Unlock current roadmap if any
    if (roadmapData) {
      const unlocked = {
        ...roadmapData,
        weeks: roadmapData.weeks.map(w => ({ ...w, isLocked: false }))
      };
      setRoadmapData(unlocked);
      const st = getInitialState();
      st.roadmap = unlocked;
      saveState(st);
    }

    addBotMessage(
      strings.registrationSuccess,
      getMainFeatureChips()
    );
  };

  return (
    <div
      className={`flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors ${
        isEmbedded ? "h-full w-full" : "h-[calc(100vh-4rem)] max-w-4xl mx-auto border-x border-zinc-200 dark:border-zinc-800 shadow-xl"
      }`}
    >
      {/* Active Student Mini Banner */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-zinc-600 dark:text-zinc-400">
            {profile ? (
              <>
                <strong>{profile.branch}</strong> ({profile.year} Year) • Target: <strong>{profile.targetRole}</strong>
              </>
            ) : (
              <span>CareerPilot Personal Guide Online 👋</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {profile && (
            <button
              onClick={() => {
                setOnboardingStep("branch");
                addBotMessage(CHAT_STRINGS.editProfilePrompt, BRANCH_CHIPS);
              }}
              className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-semibold"
            >
              Edit Profile
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
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                    CP
                  </div>
                  <span>CareerPilot Guide</span>
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
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-to-tr from-orange-600 to-amber-600 text-white rounded-tr-none shadow-md"
                  : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-800 shadow-sm"
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>

            {/* In-Feed Cards */}
            {msg.cardPayload && (
              <div className="w-full mt-2">
                {msg.cardPayload.type === "onboarding_summary" && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-900 border border-orange-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <h4 className="font-bold text-xs uppercase tracking-wider text-orange-900 dark:text-orange-300">
                          Profile Ready
                        </h4>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                        30s Fast Onboard
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/60 dark:bg-zinc-800/60 p-2 rounded-xl">
                        <span className="text-zinc-400 text-[10px] block">Branch & Year</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {msg.cardPayload.data?.branch} ({msg.cardPayload.data?.year} Year)
                        </span>
                      </div>
                      <div className="bg-white/60 dark:bg-zinc-800/60 p-2 rounded-xl">
                        <span className="text-zinc-400 text-[10px] block">Target Role</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {msg.cardPayload.data?.targetRole}
                        </span>
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
                    onUnlockRoadmap={() => setIsRegModalOpen(true)}
                  />
                )}

                {msg.cardPayload.type === "jobs_preview" && (
                  <JobsCard
                    jobs={msg.cardPayload.data}
                    onUnlockAllJobs={() => setIsRegModalOpen(true)}
                  />
                )}
              </div>
            )}

            {/* Quick Action Chips */}
            {msg.chips && msg.chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
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
              Career guide typing...
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
            placeholder="Type any career question or message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white shadow-md shadow-orange-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Feature Modals */}
      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSubmitResume={handleSubmitResume}
      />

      <MockInterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        roleId={profile?.targetRole || "software-developer"}
        onComplete={handleInterviewCompleted}
      />

      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onSuccess={handleRegistrationCompleted}
      />
    </div>
  );
}
