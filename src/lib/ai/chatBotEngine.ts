import { ActionChip, StudentProfile } from "../types";
import { getActiveLLMProvider, LLMProvider } from "./provider";

export const OPENING_MESSAGE =
  "Hey! I'm CareerPilot 👋 Your personal career guide. Tell me about yourself — what college branch or year are you in, and what career goals are you targeting? Or ask me anything to get started!";

export const OPENING_MESSAGE_ENGLISH = OPENING_MESSAGE;
export const OPENING_MESSAGE_HINGLISH = OPENING_MESSAGE;

export const INITIAL_CHIPS: ActionChip[] = [
  { id: "f-resume", label: "📄 ATS Resume Review", value: "feature_resume" },
  { id: "f-roadmap", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" },
  { id: "f-jobs", label: "💼 Matched Jobs", value: "feature_jobs" },
  { id: "f-interview", label: "🎙️ 5-Min Mock Interview", value: "feature_interview" }
];

export const INITIAL_CHIPS_ENGLISH = INITIAL_CHIPS;
export const INITIAL_CHIPS_HINGLISH = INITIAL_CHIPS;

export const BRANCH_CHIPS: ActionChip[] = [
  { id: "b-cse", label: "💻 CSE", value: "CSE" },
  { id: "b-it", label: "🌐 IT", value: "IT" },
  { id: "b-ece", label: "📡 ECE", value: "ECE" },
  { id: "b-eee", label: "⚡ EEE", value: "EEE" },
  { id: "b-mech", label: "⚙️ Mech", value: "Mech" },
  { id: "b-civil", label: "🏗️ Civil", value: "Civil" },
  { id: "b-bca", label: "🖥️ BCA", value: "BCA" },
  { id: "b-bba", label: "📊 BBA", value: "BBA" },
  { id: "b-other", label: "🎯 Other", value: "Other" }
];

export const YEAR_CHIPS: ActionChip[] = [
  { id: "y-1", label: "🌱 1st Year", value: "1" },
  { id: "y-2", label: "📘 2nd Year", value: "2" },
  { id: "y-3", label: "🚀 3rd Year", value: "3" },
  { id: "y-4", label: "🎯 4th Year (Final)", value: "4" },
  { id: "y-pass", label: "🎓 Graduated / Passed Out", value: "passed_out" }
];

export const YEAR_CHIPS_ENGLISH = YEAR_CHIPS;
export const YEAR_CHIPS_HINGLISH = YEAR_CHIPS;

export const SKILL_CHIPS: ActionChip[] = [
  { id: "s-py", label: "Python", value: "Python" },
  { id: "s-java", label: "Java", value: "Java" },
  { id: "s-cpp", label: "C++", value: "C++" },
  { id: "s-sql", label: "SQL", value: "SQL" },
  { id: "s-js", label: "JavaScript", value: "JavaScript" },
  { id: "s-html", label: "HTML/CSS", value: "HTML/CSS" },
  { id: "s-excel", label: "Excel", value: "Excel" },
  { id: "s-comm", label: "Communication", value: "Communication" },
  { id: "s-done", label: "✅ Done selecting skills", value: "done_skills" }
];

export const SKILL_CHIPS_ENGLISH = SKILL_CHIPS;
export const SKILL_CHIPS_HINGLISH = SKILL_CHIPS;

export const GOAL_CHIPS: ActionChip[] = [
  { id: "g-sde", label: "Software Developer", value: "software-developer" },
  { id: "g-data", label: "Data Analyst", value: "data-analyst" },
  { id: "g-py", label: "Python Developer", value: "python-developer" },
  { id: "g-qa", label: "QA / Test Engineer", value: "qa-test-engineer" },
  { id: "g-java", label: "Java Developer", value: "java-developer" },
  { id: "g-mkt", label: "Digital Marketing", value: "digital-marketing" },
  { id: "g-mech", label: "Core Mechanical", value: "core-mechanical" },
  { id: "g-civil", label: "Core Civil", value: "core-civil" },
  { id: "g-elec", label: "Core Electrical", value: "core-electrical" },
  { id: "g-sales", label: "Sales / BDA", value: "sales-bda" },
  { id: "g-unsure", label: "🤷 Not sure (Recommend for me)", value: "not_sure" }
];

export const GOAL_CHIPS_ENGLISH = GOAL_CHIPS;
export const GOAL_CHIPS_HINGLISH = GOAL_CHIPS;

export const MAIN_FEATURE_CHIPS: ActionChip[] = [
  { id: "f-resume", label: "📄 ATS Resume Review", value: "feature_resume" },
  { id: "f-roadmap", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" },
  { id: "f-jobs", label: "💼 Matched Jobs", value: "feature_jobs" },
  { id: "f-interview", label: "🎙️ 5-Min Mock Interview", value: "feature_interview" }
];

export const MAIN_FEATURE_CHIPS_ENGLISH = MAIN_FEATURE_CHIPS;
export const MAIN_FEATURE_CHIPS_HINGLISH = MAIN_FEATURE_CHIPS;

// Helpers to get chips
export function getYearChips(): ActionChip[] {
  return YEAR_CHIPS;
}

export function getSkillChips(): ActionChip[] {
  return SKILL_CHIPS;
}

export function getGoalChips(): ActionChip[] {
  return GOAL_CHIPS;
}

export function getMainFeatureChips(): ActionChip[] {
  return MAIN_FEATURE_CHIPS;
}

export function getInitialChips(): ActionChip[] {
  return INITIAL_CHIPS;
}

// English String Dictionary for Chatbot
export const CHAT_STRINGS = {
  welcome: OPENING_MESSAGE,
  initialChips: INITIAL_CHIPS,
  askBranch: "Awesome! First off, what branch or course are you studying in college?",
  askYear: "Got it! Which year of study are you currently in?",
  askSkills: "Which skills or technologies have you worked with so far? Select multiple or type below.",
  skillAdded: (val: string, count: number) =>
    `Added: ${val} (${count} selected). Any other skills to add, or ready to continue?`,
  askGoal: "What is your primary target career role for the next 6 to 12 months?",
  recommendRolesPrompt:
    "No worries at all! Based on your branch and skills, these roles are ideal matches. Which one would you like to explore?",
  profileCreated: "Here is your profile! Where would you like to get started first?",
  roadmapReady:
    "Here is your personalised 90-day roadmap! First 2 weeks preview is unlocked with vetted free resources.",
  jobsReady:
    "Here are the top jobs matched to your skills. Potential scam postings have been auto-flagged by heuristics!",
  resumeReviewed: (score: number) =>
    `Resume audit complete! Your ATS score is ${score}/100. Check full Mistake #1 fix below.`,
  softRegistrationPrompt:
    "Want to save your progress and unlock the remaining ATS fixes and full 12 weeks? 1-tap free registration unlocks it all.",
  registrationSuccess:
    "Congratulations! Registration complete 🎉 All 12 weeks, remaining 2 ATS fixes, and Mock Interview are unlocked!",
  editProfilePrompt: "Let's update your profile! Which branch are you in?",
  defaultReply:
    "Understood! To accelerate your career journey, here are the 4 key tools ready for you. Which would you like to explore?",
  unlockFullRoadmapChip: "🔓 Unlock Full 12 Weeks",
  checkJobsChip: "💼 Check Matched Jobs",
  unlockFixesChip: "🔓 Unlock Remaining 2 Fixes",
  seeRoadmapChip: "🗺️ See 90-Day Roadmap",
  practiceInterviewChip: "🎙️ Practice Mock Interview",
  checkResumeChip: "📄 Check Resume Score",
  saveProgressChip: "Save Progress & Unlock 🚀"
};

// Aliases for backwards compatibility
export const BRANCH_CHIPS_DEFAULT = BRANCH_CHIPS;

export function getRecommendedRolesForStudent(branch: string, skills: string[]): ActionChip[] {
  const normBranch = branch.toUpperCase();

  if (normBranch === "MECH") {
    return [
      { id: "r-mech", label: "Core Mechanical Engineer", value: "core-mechanical" },
      { id: "r-sde", label: "Software Developer (Switch to IT)", value: "software-developer" }
    ];
  }
  if (normBranch === "CIVIL") {
    return [
      { id: "r-civil", label: "Core Civil Structural Engineer", value: "core-civil" },
      { id: "r-data", label: "Data Analyst", value: "data-analyst" }
    ];
  }
  if (normBranch === "EEE") {
    return [
      { id: "r-elec", label: "Core Electrical & Automation", value: "core-electrical" },
      { id: "r-py", label: "Python Developer", value: "python-developer" }
    ];
  }
  if (normBranch === "BBA") {
    return [
      { id: "r-mkt", label: "Digital Marketing Specialist", value: "digital-marketing" },
      { id: "r-sales", label: "Sales / Business Development", value: "sales-bda" },
      { id: "r-data", label: "Business Data Analyst", value: "data-analyst" }
    ];
  }

  // Default tech recommendation
  return [
    { id: "r-sde", label: "Software Developer (Web)", value: "software-developer" },
    { id: "r-data", label: "Data Analyst", value: "data-analyst" },
    { id: "r-qa", label: "QA / Test Automation", value: "qa-test-engineer" }
  ];
}

// Intelligent Personal Career Guide Prompt Responder Fallback (English-Only)
export function generateCareerGuideReply(
  userQuery: string,
  profile: StudentProfile | null
): {
  text: string;
  chips: ActionChip[];
} {
  return {
    text: "I'm CareerPilot 👋 Tell me about your branch, year, and target goals so I can guide you! You can also explore our ATS resume review, 90-day roadmap, or 5-min mock interview.",
    chips: getMainFeatureChips()
  };
}

// Alias for backward compatibility
export const generateSeniorBhaiyaReply = generateCareerGuideReply;

/**
 * ChatBot LLM Factory: returns GeminiProvider (gemini-1.5-flash) if GEMINI_API_KEY
 * is set, falling back to MockLLMProvider when unconfigured.
 */
export function getChatBotLLMProvider(): LLMProvider {
  return getActiveLLMProvider({ task: "chat" });
}

/**
 * Asynchronously generates an intelligent reply using the active LLM provider,
 * passing student profile context and returning response text + action chips.
 */
export async function generateChatBotLLMReply(
  userQuery: string,
  profile: StudentProfile | null,
  provider: LLMProvider = getChatBotLLMProvider()
): Promise<{ text: string; chips: ActionChip[] }> {
  const profileContext = profile
    ? `Target Role: ${profile.targetRole || "Unknown"}, Branch: ${profile.branch || "Unknown"}, Year: ${profile.year || "Unknown"}, Skills: ${profile.skills?.join(", ") || "None listed"}.`
    : "No student profile available yet.";

  const systemContext = `Student Profile Context:\n${profileContext}`;
  const response = await provider.generateText(userQuery, systemContext);

  return {
    text: response.text,
    chips: getMainFeatureChips()
  };
}

/**
 * Asynchronously streams reply chunks from the active LLM provider.
 */
export async function* generateChatBotLLMStream(
  userQuery: string,
  profile: StudentProfile | null,
  provider: LLMProvider = getChatBotLLMProvider()
): AsyncGenerator<string, void, unknown> {
  const profileContext = profile
    ? `Target Role: ${profile.targetRole || "Unknown"}, Branch: ${profile.branch || "Unknown"}, Year: ${profile.year || "Unknown"}, Skills: ${profile.skills?.join(", ") || "None listed"}.`
    : "No student profile available yet.";

  const systemContext = `Student Profile Context:\n${profileContext}`;

  if (typeof provider.generateStream === "function") {
    for await (const chunk of provider.generateStream(userQuery, systemContext)) {
      yield chunk;
    }
  } else {
    const res = await provider.generateText(userQuery, systemContext);
    yield res.text;
  }
}

