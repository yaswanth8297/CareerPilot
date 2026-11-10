"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Send, FileText } from "lucide-react";
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
  getMainFeatureChips,
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

  // Queued feature intent when arriving from landing page cards
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
        { id: "c-apply", label: "Improve Resume ATS For These Jobs", value: "feature_resume" },
        { id: "c-rm", label: strings.seeRoadmapChip, value: "feature_roadmap" }
      ],
      {
        type: "jobs_preview",
        data: ranked.slice(0, 4)
      }
    );
  };

  // Immediate feature trigger when user arrives with intent
  const handleExecuteIntent = (intent: FeatureIntent) => {
    if (intent === "resume_check") {
      logAnalytics("feature_selected", { feature: "resume_check" });
      addBotMessage(
        "Ready to audit your resume. Upload your PDF or paste your resume text to receive a 100-point ATS breakdown and 3 concrete bullet fixes.",
        [
          { id: "c-open-resume", label: "Upload Resume", value: "feature_resume" },
          ...getMainFeatureChips()
        ]
      );
      setTimeout(() => setIsResumeModalOpen(true), 300);
    } else if (intent === "roadmap") {
      logAnalytics("feature_selected", { feature: "roadmap" });
      addBotMessage("Generating your personalized 90-Day Placement Roadmap...");
      setTimeout(() => handleTriggerRoadmap(), 300);
    } else if (intent === "jobs") {
      logAnalytics("feature_selected", { feature: "jobs" });
      addBotMessage("Finding verified fresher openings and filtering suspicious listings...");
      setTimeout(() => handleTriggerJobs(), 300);
    } else if (intent === "mock_interview") {
      logAnalytics("feature_selected", { feature: "mock_interview" });
      addBotMessage("Preparing your 5-Minute Mock Interview session with fresher-tuned questions...");
      setTimeout(() => {
        const currSt = getInitialState();
        if (!currSt.isRegistered) {
          setIsRegModalOpen(true);
        } else {
          setIsInterviewModalOpen(true);
        }
      }, 300);
    }
  };

  // Initialize Chat Session
  useEffect(() => {
    const st = getInitialState();
    setIsRegistered(st.isRegistered);
    if (st.profile) setProfile(st.profile);
    if (st.currentResumeResult) setResumeResult(st.currentResumeResult);
    if (st.roadmap) setRoadmapData(st.roadmap);

    if (st.sessionId) {
      setSessionId(st.sessionId);
    } else {
      const newId = "sess_" + Math.random().toString(36).substring(2, 9);
      st.sessionId = newId;
      setSessionId(newId);
      saveState(st);
    }

    if (st.messages && st.messages.length > 0) {
      setMessages(st.messages);
    } else {
      const opening: ChatMessage = {
        id: "msg_init",
        sender: "bot",
        text: OPENING_MESSAGE,
        timestamp: new Date().toISOString(),
        chips: INITIAL_CHIPS
      };
      setMessages([opening]);
      st.messages = [opening];
      saveState(st);
    }
  }, []);

  // Handle intent routing
  useEffect(() => {
    if (!activeIntent) return;
    const normalized = normalizeIntent(activeIntent);
    if (!normalized) return;

    if (lastHandledIntentRef.current !== normalized) {
      lastHandledIntentRef.current = normalized;
      handleExecuteIntent(normalized);
    }
  }, [activeIntent]);

  // Handle Quick Action Chip Click
  const handleChipClick = (chip: ActionChip) => {
    logAnalytics("chip_clicked", { chipId: chip.id, value: chip.value });

    if (chip.value === "feature_resume") {
      setIsResumeModalOpen(true);
      return;
    }
    if (chip.value === "feature_roadmap") {
      handleTriggerRoadmap();
      return;
    }
    if (chip.value === "feature_jobs") {
      handleTriggerJobs();
      return;
    }
    if (chip.value === "feature_interview") {
      if (!isRegistered) {
        setIsRegModalOpen(true);
      } else {
        setIsInterviewModalOpen(true);
      }
      return;
    }
    if (chip.value === "open_reg") {
      setIsRegModalOpen(true);
      return;
    }
    if (chip.value === "go_dashboard") {
      if (typeof window !== "undefined") window.location.href = "/dashboard";
      return;
    }

    handleUserTurn(chip.label);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText("");
    handleUserTurn(text);
  };

  const handleUserTurn = async (userText: string) => {
    addUserMessage(userText);

    const st = getInitialState();
    const currProfile = st.profile || profile;

    // Detect contextual student attributes to keep profile updated
    const lower = userText.toLowerCase();
    const updatedProf: StudentProfile = currProfile
      ? { ...currProfile }
      : {
          sessionId: sessionId || "sess_auto",
          branch: "CSE",
          year: "3",
          skills: ["JavaScript", "Python"],
          careerGoal: "Software Developer",
          targetRole: "Software Developer",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

    if (lower.includes("cse") || lower.includes("computer science")) updatedProf.branch = "CSE";
    else if (lower.includes("it") || lower.includes("information tech")) updatedProf.branch = "IT";
    else if (lower.includes("mech") || lower.includes("mechanical")) updatedProf.branch = "Mechanical";
    else if (lower.includes("civil")) updatedProf.branch = "Civil";
    else if (lower.includes("ece") || lower.includes("electronics")) updatedProf.branch = "ECE";
    else if (lower.includes("eee") || lower.includes("electrical")) updatedProf.branch = "EEE";

    if (lower.includes("1st year") || lower.includes("first year") || lower.includes("1st yr")) updatedProf.year = "1";
    else if (lower.includes("2nd year") || lower.includes("second year") || lower.includes("2nd yr")) updatedProf.year = "2";
    else if (lower.includes("3rd year") || lower.includes("third year") || lower.includes("3rd yr")) updatedProf.year = "3";
    else if (lower.includes("4th year") || lower.includes("final year") || lower.includes("4th yr")) updatedProf.year = "4";

    if (lower.includes("data analyst") || lower.includes("data analytics")) updatedProf.targetRole = "Data Analyst";
    else if (lower.includes("full stack") || lower.includes("web dev") || lower.includes("frontend") || lower.includes("software dev") || lower.includes("sde")) updatedProf.targetRole = "Software Developer";
    else if (lower.includes("python dev")) updatedProf.targetRole = "Python Developer";
    else if (lower.includes("qa") || lower.includes("test")) updatedProf.targetRole = "QA / Test Engineer";

    setProfile(updatedProf);
    st.profile = updatedProf;
    saveState(st);

    const botMsgId = "bot_" + Math.random().toString(36).substring(2, 9);
    const botMsg: ChatMessage = {
      id: botMsgId,
      sender: "bot",
      text: "",
      timestamp: new Date().toISOString(),
      chips: getMainFeatureChips()
    };
    setMessages(prev => [...prev, botMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, profile: updatedProf })
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;

          setMessages(prev =>
            prev.map(m => (m.id === botMsgId ? { ...m, text: fullText } : m))
          );
        }
      } else {
        fullText = await res.text();
        setMessages(prev =>
          prev.map(m => (m.id === botMsgId ? { ...m, text: fullText } : m))
        );
      }

      const finalSt = getInitialState();
      finalSt.messages = finalSt.messages || [];
      const idx = finalSt.messages.findIndex(m => m.id === botMsgId);
      const finalized = { ...botMsg, text: fullText };
      if (idx >= 0) {
        finalSt.messages[idx] = finalized;
      } else {
        finalSt.messages.push(finalized);
      }
      saveState(finalSt);
    } catch (err) {
      console.warn("Falling back to offline career guide response:", err);
      const fallback = generateCareerGuideReply(userText, updatedProf);
      setMessages(prev =>
        prev.map(m => (m.id === botMsgId ? { ...m, text: fallback.text, chips: fallback.chips } : m))
      );
    }
  };

  const handleSubmitResume = (resumeText: string, fileName?: string) => {
    setIsResumeModalOpen(false);
    setIsBotTyping(true);

    const activeRole = profile?.targetRole || "Software Developer";
    const result = analyzeResumeContent({
      resumeText,
      targetRole: activeRole,
      isRegistered
    });

    setIsBotTyping(false);
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

  const handleInterviewCompleted = (report: InterviewReport) => {
    setIsInterviewModalOpen(false);
    const strings = CHAT_STRINGS;

    const st = getInitialState();
    st.interviewHistory = [report, ...(st.interviewHistory || [])];
    saveState(st);

    fireValueConfetti();
    logAnalytics("mock_interview_completed", { score: report.overallScore });

    addBotMessage(
      `Mock interview complete. Overall rating: ${report.overallScore}/10.\nTop strength: "${report.strengths[0]}". Full feedback report saved to My Space.`,
      [
        { id: "c-dash", label: "Open My Space Dashboard", value: "go_dashboard" },
        { id: "c-rm", label: strings.seeRoadmapChip, value: "feature_roadmap" },
        { id: "c-jobs", label: strings.checkJobsChip, value: "feature_jobs" }
      ],
      {
        type: "interview_invite",
        data: report
      }
    );
  };

  const handleRegistrationCompleted = () => {
    setIsRegModalOpen(false);
    setIsRegistered(true);

    const strings = CHAT_STRINGS;
    fireValueConfetti();
    logAnalytics("registration_completed");

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
      className={`flex flex-col bg-[#FAFAF8] transition-colors ${
        isEmbedded ? "h-full w-full" : "h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full border-x border-[#E7E5DE] shadow-atelier"
      }`}
    >
      {/* Active Student Status Header */}
      <div className="bg-white border-b border-[#E7E5DE] px-5 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#166534]" />
          <span className="text-[#52555E] font-sans">
            {profile ? (
              <>
                <strong className="text-[#141518] font-medium">{profile.branch}</strong> ({profile.year} Year) · Target:{" "}
                <strong className="text-[#183059] font-semibold">{profile.targetRole}</strong>
              </>
            ) : (
              <span>CareerPilot Advisor Ready</span>
            )}
          </span>
        </div>

        {profile && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#52555E] bg-[#F4F3EE] border border-[#E7E5DE] px-2 py-0.5 rounded-md font-medium">
            Profile Active
          </span>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} animate-in fade-in duration-150`}
          >
            {/* Sender Tag */}
            <div className="flex items-center gap-2 mb-1.5 text-[11px] text-[#82858E] font-mono">
              {msg.sender === "bot" ? (
                <>
                  <span className="w-5 h-5 rounded-md bg-[#183059] flex items-center justify-center text-white text-[9px] font-bold">
                    CP/
                  </span>
                  <span className="font-sans font-medium text-[#52555E]">CareerPilot Guide</span>
                </>
              ) : (
                <>
                  <span className="font-sans text-[#52555E]">You</span>
                  <span className="w-5 h-5 rounded-md bg-[#E7E5DE] text-[#141518] flex items-center justify-center text-[9px] font-bold">
                    U
                  </span>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#183059] text-white"
                  : "bg-white text-[#141518] border border-[#E7E5DE] shadow-xs"
              }`}
            >
              {msg.text ? (
                <p className="whitespace-pre-line font-sans">{msg.text}</p>
              ) : (
                <div className="flex items-center gap-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#183059] animate-pulse" />
                  <span className="font-mono text-xs text-[#82858E]">
                    Formulating guidance...
                  </span>
                </div>
              )}
            </div>

            {/* In-Feed Cards */}
            {msg.cardPayload && (
              <div className="w-full mt-3">
                {msg.cardPayload.type === "onboarding_summary" && (
                  <div className="p-4 rounded-xl bg-white border border-[#E7E5DE] shadow-xs space-y-3 max-w-xl">
                    <div className="flex items-center justify-between border-b border-[#F4F3EE] pb-2">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#183059]">
                        Profile Verified
                      </span>
                      <span className="font-mono text-[10px] bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] px-2 py-0.5 rounded font-semibold">
                        Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#FAFAF8] p-2.5 rounded-lg border border-[#E7E5DE]">
                        <span className="text-[#82858E] text-[10px] font-mono block">Branch &amp; Year</span>
                        <span className="font-semibold text-[#141518]">
                          {msg.cardPayload.data?.branch} ({msg.cardPayload.data?.year} Year)
                        </span>
                      </div>
                      <div className="bg-[#FAFAF8] p-2.5 rounded-lg border border-[#E7E5DE]">
                        <span className="text-[#82858E] text-[10px] font-mono block">Target Role</span>
                        <span className="font-semibold text-[#141518]">
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
              <div className="flex flex-wrap gap-2 mt-3 max-w-[95%]">
                {msg.chips.map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#F4F3EE] text-[#141518] border border-[#E7E5DE] hover:border-[#183059]/40 transition-colors flex items-center gap-1.5 active:translate-y-px cursor-pointer"
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
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E7E5DE] w-fit shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#183059] animate-pulse" />
            <span className="text-xs text-[#82858E] font-mono">
              Reviewing data...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-[#E7E5DE]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsResumeModalOpen(true)}
            className="h-11 px-3 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-[#52555E] hover:text-[#183059] hover:border-[#D3D0C7] transition-colors cursor-pointer flex items-center justify-center"
            title="Upload or Paste Resume"
          >
            <FileText className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask about resume fixes, roadmaps, or interview prep..."
            className="flex-1 h-11 px-3.5 rounded-lg bg-[#FAFAF8] border border-[#E7E5DE] text-sm text-[#141518] placeholder:text-[#82858E] focus:outline-none focus:ring-2 focus:ring-[#183059] focus:border-transparent transition-all font-sans"
            autoFocus
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isBotTyping}
            className="h-11 w-11 rounded-lg bg-[#183059] hover:bg-[#102344] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
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
