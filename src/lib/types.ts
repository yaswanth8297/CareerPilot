import { z } from "zod";

// --- Profile & User ---
export type LanguagePref = "hinglish" | "en";
export type StudentYear = "1" | "2" | "3" | "4" | "passed_out";

export interface StudentProfile {
  id?: string;
  sessionId: string;
  userId?: string | null;
  branch: string;
  year: StudentYear;
  skills: string[];
  careerGoal: string;
  targetRole: string;
  languagePref: LanguagePref;
  collegeName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  role: "student" | "admin";
  createdAt: string;
}

// --- Chat Messages ---
export interface ActionChip {
  id: string;
  label: string;
  value: string;
  icon?: string;
  actionType?: "select_option" | "trigger_feature" | "open_modal" | "custom";
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user" | "system";
  text: string;
  timestamp: string;
  chips?: ActionChip[];
  cardPayload?: {
    type: "onboarding_summary" | "resume_preview" | "roadmap_preview" | "jobs_preview" | "interview_invite" | "registration_prompt";
    data?: any;
  };
}

// --- Resume Analysis Rubric ---
export interface ATSScoreBreakdown {
  formatting: number; // Max 20
  keywordMatch: number; // Max 30
  quantifiedImpact: number; // Max 20
  sectionCompleteness: number; // Max 15
  lengthAndClarity: number; // Max 15
  totalScore: number; // Max 100
}

export interface ATSMistake {
  id: number;
  title: string;
  whatIsWrong: string;
  whyItHurts: string;
  howToFix: string;
  beforeExample: string;
  afterExample: string;
  isLocked?: boolean;
}

export interface ResumeAnalysisResult {
  score: number;
  breakdown: ATSScoreBreakdown;
  verdict: string;
  mistakes: ATSMistake[];
  targetRole: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  analyzedAt: string;
  fileName?: string;
}

// --- 90-Day Roadmap ---
export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  estMinutes: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  phase: "Foundation" | "Build" | "Job Ready";
  title: string;
  description: string;
  topics: string[];
  tasks: RoadmapTask[];
  resourceId?: string;
  resourceTitle: string;
  resourceUrl: string;
  isLocked: boolean;
}

export interface RoadmapData {
  role: string;
  phaseNames: [string, string, string];
  weeks: RoadmapWeek[];
  totalWeeks: number;
  progressPercent: number;
}

// --- Curated Resources ---
export interface CuratedResource {
  id: string;
  title: string;
  language: "en" | "hinglish" | "hi";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  url: string;
  roleTags: string[];
  platform: string;
  isFree: boolean;
  verifiedAt: string;
}

// --- Jobs ---
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  jobType: "Internship" | "Fresher" | "Full-time";
  matchPercent: number;
  whyItMatches: string;
  matchedSkills: string[];
  missingSkills: string[];
  minCgpaRequired?: number;
  hasCgpaFilter: boolean;
  isScamSuspicious: boolean;
  scamReasons?: string[];
  applyUrl: string;
  postedDate: string;
  salaryRange?: string;
}

// --- Mock Interview ---
export interface InterviewQuestion {
  id: string;
  role: string;
  category: "Introduction" | "Technical" | "Project" | "HR/Behavioral";
  questionHinglish: string;
  questionEnglish: string;
  expectedKeywords: string[];
  sampleIdealAnswer: string;
}

export interface InterviewUserAnswer {
  questionId: string;
  userAnswer: string;
  timeSpentSeconds: number;
}

export interface InterviewReport {
  sessionId: string;
  overallScore: number; // out of 10
  contentAccuracyScore: number; // out of 10
  clarityScore: number; // out of 10
  confidenceScore: number; // out of 10
  communicationScore: number; // out of 10
  strengths: string[];
  improvements: string[];
  weakestQuestionIndex: number;
  idealAnswerForWeakest: string;
  nextRoadmapAction: string;
  createdAt: string;
}

// --- Analytics & Flags ---
export interface AnalyticsEvent {
  eventName: string;
  sessionId: string;
  timestamp: string;
  payload?: Record<string, any>;
}

export interface FeatureFlags {
  lockAtsMistakes2and3: boolean;
  enableVoiceInterviewMock: boolean;
  requireStrictOTP: boolean;
  enablePostHogTracking: boolean;
}

// --- Zod Schemas for Validation ---
export const ProfileOnboardingSchema = z.object({
  branch: z.string().min(1, "Branch is required"),
  year: z.enum(["1", "2", "3", "4", "passed_out"]),
  skills: z.array(z.string()).min(1, "Select at least 1 skill"),
  careerGoal: z.string().min(1, "Career goal is required"),
  languagePref: z.enum(["hinglish", "en"]).default("hinglish"),
});
