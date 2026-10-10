import {
  StudentProfile,
  ResumeAnalysisResult,
  RoadmapData,
  JobListing,
  InterviewReport,
  FeatureFlags,
  AnalyticsEvent,
  User,
  ChatMessage,
  LanguagePref
} from "../types";

export interface AppStoreState {
  user: User | null;
  sessionId: string;
  isRegistered: boolean;
  languagePref: LanguagePref;
  profile: StudentProfile | null;
  messages: ChatMessage[];
  currentResumeResult: ResumeAnalysisResult | null;
  resumeHistory: ResumeAnalysisResult[];
  roadmap: RoadmapData | null;
  savedJobs: JobListing[];
  interviewHistory: InterviewReport[];
  featureFlags: FeatureFlags;
  analyticsEvents: AnalyticsEvent[];
}

const DEFAULT_FLAGS: FeatureFlags = {
  lockAtsMistakes2and3: true,
  enableVoiceInterviewMock: false,
  requireStrictOTP: false,
  enablePostHogTracking: false
};

const STORAGE_KEY = "careerpilot_store_v1";

export function getInitialState(): AppStoreState {
  if (typeof window === "undefined") {
    return {
      user: null,
      sessionId: "session_server",
      isRegistered: false,
      languagePref: "hinglish",
      profile: null,
      messages: [],
      currentResumeResult: null,
      resumeHistory: [],
      roadmap: null,
      savedJobs: [],
      interviewHistory: [],
      featureFlags: DEFAULT_FLAGS,
      analyticsEvents: []
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.languagePref) parsed.languagePref = "hinglish";
      return parsed;
    }
  } catch (e) {
    console.warn("Error reading localStorage:", e);
  }

  // Generate new guest session
  const newSessionId = "guest_" + Math.random().toString(36).substring(2, 10);
  const fresh: AppStoreState = {
    user: null,
    sessionId: newSessionId,
    isRegistered: false,
    languagePref: "hinglish",
    profile: null,
    messages: [],
    currentResumeResult: null,
    resumeHistory: [],
    roadmap: null,
    savedJobs: [],
    interviewHistory: [],
    featureFlags: DEFAULT_FLAGS,
    analyticsEvents: []
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch (e) {}

  return fresh;
}

export function getStoredLanguage(): LanguagePref {
  if (typeof window === "undefined") return "hinglish";
  const state = getInitialState();
  return state.languagePref || "hinglish";
}

export function setStoredLanguage(lang: LanguagePref): void {
  if (typeof window === "undefined") return;
  const state = getInitialState();
  state.languagePref = lang;
  if (state.profile) {
    state.profile.languagePref = lang;
    state.profile.updatedAt = new Date().toISOString();
  }
  saveState(state);
  window.dispatchEvent(new CustomEvent("careerpilot_language_changed", { detail: lang }));
}

export function saveState(state: AppStoreState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving state to localStorage:", e);
  }
}

// Log analytics event (stores locally and redactions applied)
export function logAnalytics(eventName: string, payload?: Record<string, any>): void {
  if (typeof window === "undefined") return;
  try {
    const state = getInitialState();
    const event: AnalyticsEvent = {
      eventName,
      sessionId: state.sessionId,
      timestamp: new Date().toISOString(),
      payload
    };
    state.analyticsEvents.push(event);
    saveState(state);
  } catch (e) {}
}

// Migrate guest session to registered user (Idempotent single transaction per PRD)
export function migrateGuestToUser(phoneOrEmail: string, name?: string): { success: boolean; user: User } {
  const state = getInitialState();
  const userId = "usr_" + Math.random().toString(36).substring(2, 9);

  const newUser: User = {
    id: userId,
    name: name || "Student Pilot",
    phone: phoneOrEmail.includes("@") ? undefined : phoneOrEmail,
    email: phoneOrEmail.includes("@") ? phoneOrEmail : undefined,
    role: "student",
    createdAt: new Date().toISOString()
  };

  state.user = newUser;
  state.isRegistered = true;

  if (state.profile) {
    state.profile.userId = userId;
    state.profile.updatedAt = new Date().toISOString();
  }

  // Unlock roadmap weeks
  if (state.roadmap) {
    state.roadmap.weeks = state.roadmap.weeks.map(w => ({ ...w, isLocked: false }));
  }

  // Unlock resume mistakes
  if (state.currentResumeResult) {
    state.currentResumeResult.mistakes = state.currentResumeResult.mistakes.map(m => ({ ...m, isLocked: false }));
  }

  saveState(state);
  logAnalytics("registration_completed", { userId, previousSessionId: state.sessionId });

  return { success: true, user: newUser };
}
