import { ActionChip, LanguagePref, StudentProfile } from "../types";

export const OPENING_MESSAGE_HINGLISH =
  "Hey! Main CareerPilot hoon 👋 Tere career ka senior bhaiya/didi. 30 second mein tera profile bana deta hoon, phir resume check, roadmap, jobs aur mock interview sab milega. Ready?";

export const OPENING_MESSAGE_ENGLISH =
  "Hey! I'm CareerPilot 👋 Your friendly career senior. Let's set up your profile in 30 seconds, then unlock resume review, 90-day roadmap, job matches, and mock interview. Ready?";

export const INITIAL_CHIPS_HINGLISH: ActionChip[] = [
  { id: "c-ready", label: "Haan bilkul, chalo! 🚀", value: "ready" },
  { id: "c-info", label: "Pehle batao kya milega?", value: "tell_more" }
];

export const INITIAL_CHIPS_ENGLISH: ActionChip[] = [
  { id: "c-ready-en", label: "Yes, let's do it! 🚀", value: "ready" },
  { id: "c-info-en", label: "Tell me what's inside?", value: "tell_more" }
];

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

export const YEAR_CHIPS_HINGLISH: ActionChip[] = [
  { id: "y-1", label: "🌱 1st Year", value: "1" },
  { id: "y-2", label: "📘 2nd Year", value: "2" },
  { id: "y-3", label: "🚀 3rd Year", value: "3" },
  { id: "y-4", label: "🎯 4th Year (Final)", value: "4" },
  { id: "y-pass", label: "🎓 Passed Out", value: "passed_out" }
];

export const YEAR_CHIPS_ENGLISH: ActionChip[] = [
  { id: "y-1-en", label: "🌱 1st Year", value: "1" },
  { id: "y-2-en", label: "📘 2nd Year", value: "2" },
  { id: "y-3-en", label: "🚀 3rd Year", value: "3" },
  { id: "y-4-en", label: "🎯 4th Year (Final)", value: "4" },
  { id: "y-pass-en", label: "🎓 Graduated / Passed Out", value: "passed_out" }
];

export const SKILL_CHIPS_HINGLISH: ActionChip[] = [
  { id: "s-py", label: "Python", value: "Python" },
  { id: "s-java", label: "Java", value: "Java" },
  { id: "s-cpp", label: "C++", value: "C++" },
  { id: "s-sql", label: "SQL", value: "SQL" },
  { id: "s-js", label: "JavaScript", value: "JavaScript" },
  { id: "s-html", label: "HTML/CSS", value: "HTML/CSS" },
  { id: "s-excel", label: "Excel", value: "Excel" },
  { id: "s-comm", label: "Communication", value: "Communication" },
  { id: "s-done", label: "✅ Continue with these", value: "done_skills" }
];

export const SKILL_CHIPS_ENGLISH: ActionChip[] = [
  { id: "s-py-en", label: "Python", value: "Python" },
  { id: "s-java-en", label: "Java", value: "Java" },
  { id: "s-cpp-en", label: "C++", value: "C++" },
  { id: "s-sql-en", label: "SQL", value: "SQL" },
  { id: "s-js-en", label: "JavaScript", value: "JavaScript" },
  { id: "s-html-en", label: "HTML/CSS", value: "HTML/CSS" },
  { id: "s-excel-en", label: "Excel", value: "Excel" },
  { id: "s-comm-en", label: "Communication", value: "Communication" },
  { id: "s-done-en", label: "✅ Done selecting skills", value: "done_skills" }
];

export const GOAL_CHIPS_HINGLISH: ActionChip[] = [
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
  { id: "g-unsure", label: "🤷 Not sure (Senior help karo)", value: "not_sure" }
];

export const GOAL_CHIPS_ENGLISH: ActionChip[] = [
  { id: "g-sde-en", label: "Software Developer", value: "software-developer" },
  { id: "g-data-en", label: "Data Analyst", value: "data-analyst" },
  { id: "g-py-en", label: "Python Developer", value: "python-developer" },
  { id: "g-qa-en", label: "QA / Test Engineer", value: "qa-test-engineer" },
  { id: "g-java-en", label: "Java Developer", value: "java-developer" },
  { id: "g-mkt-en", label: "Digital Marketing", value: "digital-marketing" },
  { id: "g-mech-en", label: "Core Mechanical", value: "core-mechanical" },
  { id: "g-civil-en", label: "Core Civil", value: "core-civil" },
  { id: "g-elec-en", label: "Core Electrical", value: "core-electrical" },
  { id: "g-sales-en", label: "Sales / BDA", value: "sales-bda" },
  { id: "g-unsure-en", label: "🤷 Not sure (Recommend for me)", value: "not_sure" }
];

export const MAIN_FEATURE_CHIPS_HINGLISH: ActionChip[] = [
  { id: "f-resume", label: "📄 Resume Check (ATS)", value: "feature_resume" },
  { id: "f-roadmap", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" },
  { id: "f-jobs", label: "💼 Job Matches", value: "feature_jobs" },
  { id: "f-interview", label: "🎙️ 5-Min Mock Interview", value: "feature_interview" }
];

export const MAIN_FEATURE_CHIPS_ENGLISH: ActionChip[] = [
  { id: "f-resume-en", label: "📄 ATS Resume Review", value: "feature_resume" },
  { id: "f-roadmap-en", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" },
  { id: "f-jobs-en", label: "💼 Matched Jobs", value: "feature_jobs" },
  { id: "f-interview-en", label: "🎙️ 5-Min Mock Interview", value: "feature_interview" }
];

// Helper to get chips by active language
export function getYearChips(lang: LanguagePref): ActionChip[] {
  return lang === "en" ? YEAR_CHIPS_ENGLISH : YEAR_CHIPS_HINGLISH;
}

export function getSkillChips(lang: LanguagePref): ActionChip[] {
  return lang === "en" ? SKILL_CHIPS_ENGLISH : SKILL_CHIPS_HINGLISH;
}

export function getGoalChips(lang: LanguagePref): ActionChip[] {
  return lang === "en" ? GOAL_CHIPS_ENGLISH : GOAL_CHIPS_HINGLISH;
}

export function getMainFeatureChips(lang: LanguagePref): ActionChip[] {
  return lang === "en" ? MAIN_FEATURE_CHIPS_ENGLISH : MAIN_FEATURE_CHIPS_HINGLISH;
}

export function getInitialChips(lang: LanguagePref): ActionChip[] {
  return lang === "en" ? INITIAL_CHIPS_ENGLISH : INITIAL_CHIPS_HINGLISH;
}

// Complete Bilingual String Dictionary for Chatbot
export const CHAT_STRINGS = {
  hinglish: {
    welcome: OPENING_MESSAGE_HINGLISH,
    initialChips: INITIAL_CHIPS_HINGLISH,
    askBranch: "Badhiya! Sabse pehle batao, college mein kaunsi branch ya course kar rahe ho?",
    askYear: "Sahi hai! Kaunse year mein padh rahe ho abhi?",
    askSkills: "Kaunse skills ya tech par thoda bhi haath saaf kiya hai? Multiple select kar sakte ho ya text mein batao.",
    skillAdded: (val: string, count: number) =>
      `Added: ${val} (${count} selected). Aur koi add karna hai ya continue karein?`,
    askGoal: "Agle 6-12 mahine mein tera main career target kya hai dost?",
    recommendRolesPrompt:
      "Koi tension nahi! Teri branch aur skills dekh kar ye roles best match karte hain. Kaunsa explore karein?",
    profileCreated: "Ye ban gaya tera profile! Ab batao dost, sabse pehle kahan se shuru karein?",
    roadmapReady:
      "Ye raha tera personalized 90-day roadmap! Pehle 2 weeks ka preview unlocked hai with vetted free resources.",
    jobsReady:
      "Tere skills ke hisaab se ye top jobs match hui hain. Scam postings ko humne heuristics se alert kiya hai!",
    resumeReviewed: (score: number) =>
      `Resume review ho gaya! Tera ATS score hai ${score}/100. Mistake #1 ka full fix neeche dekho.`,
    softRegistrationPrompt:
      "Progress ko save rakhna hai taaki re-upload par trend dikhe? 1-tap free registration se full fixes unlock ho jayenge.",
    registrationSuccess:
      "Mubarak ho! Registration complete ho gaya 🎉 Saare 12 weeks, remaining 2 ATS fixes aur Mock Interview unlock ho chuke hain!",
    languageSwitched: "🇮🇳 Hinglish mode active! Chalo dost, aage continue karte hain.",
    editProfilePrompt: "Chalo profile update karte hain! Kaunsi branch hai?",
    defaultReply:
      "Bilkul dost, maine note kar liya! Tera career plan accelerate karne ke liye ye 4 key tools ready hain. Kaunsa try karein?",
    unlockFullRoadmapChip: "🔓 Unlock Full 12 Weeks",
    checkJobsChip: "💼 Check Matched Jobs",
    unlockFixesChip: "🔓 Unlock Remaining 2 Fixes",
    seeRoadmapChip: "🗺️ See 90-Day Roadmap",
    practiceInterviewChip: "🎙️ Practice Mock Interview",
    checkResumeChip: "📄 Check Resume Score",
    saveProgressChip: "Save Progress & Unlock 🚀"
  },
  en: {
    welcome: OPENING_MESSAGE_ENGLISH,
    initialChips: INITIAL_CHIPS_ENGLISH,
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
    languageSwitched: "🇬🇧 English mode activated! We will continue our conversation in English.",
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
  }
};

// Aliases for backwards compatibility with tests
export const BRANCH_CHIPS_DEFAULT = BRANCH_CHIPS;
export const YEAR_CHIPS = YEAR_CHIPS_HINGLISH;
export const SKILL_CHIPS = SKILL_CHIPS_HINGLISH;
export const GOAL_CHIPS = GOAL_CHIPS_HINGLISH;
export const MAIN_FEATURE_CHIPS = MAIN_FEATURE_CHIPS_HINGLISH;

export function getRecommendedRolesForStudent(branch: string, skills: string[], lang: LanguagePref = "hinglish"): ActionChip[] {
  const normBranch = branch.toUpperCase();
  const isEn = lang === "en";

  if (normBranch === "MECH") {
    return [
      { id: "r-mech", label: isEn ? "Core Mechanical Engineer" : "Core Mechanical Engineer", value: "core-mechanical" },
      { id: "r-sde", label: isEn ? "Software Developer (Switch to IT)" : "Software Developer (Switch to IT)", value: "software-developer" }
    ];
  }
  if (normBranch === "CIVIL") {
    return [
      { id: "r-civil", label: isEn ? "Core Civil Structural Engineer" : "Core Civil Structural Engineer", value: "core-civil" },
      { id: "r-data", label: isEn ? "Data Analyst" : "Data Analyst", value: "data-analyst" }
    ];
  }
  if (normBranch === "EEE") {
    return [
      { id: "r-elec", label: isEn ? "Core Electrical & Automation" : "Core Electrical & Automation", value: "core-electrical" },
      { id: "r-py", label: isEn ? "Python Developer" : "Python Developer", value: "python-developer" }
    ];
  }
  if (normBranch === "BBA") {
    return [
      { id: "r-mkt", label: isEn ? "Digital Marketing Specialist" : "Digital Marketing Specialist", value: "digital-marketing" },
      { id: "r-sales", label: isEn ? "Sales / Business Development" : "Sales / Business Development", value: "sales-bda" },
      { id: "r-data", label: isEn ? "Business Data Analyst" : "Business Data Analyst", value: "data-analyst" }
    ];
  }

  // Default tech recommendation
  return [
    { id: "r-sde", label: isEn ? "Software Developer (Web)" : "Software Developer (Web)", value: "software-developer" },
    { id: "r-data", label: isEn ? "Data Analyst" : "Data Analyst", value: "data-analyst" },
    { id: "r-qa", label: isEn ? "QA / Test Automation" : "QA / Test Automation", value: "qa-test-engineer" }
  ];
}

// Intelligent Senior Bhaiya/Didi Prompt Responder
export function generateSeniorBhaiyaReply(
  userQuery: string,
  profile: StudentProfile | null,
  activeLang: LanguagePref
): {
  text: string;
  chips: ActionChip[];
  detectedLanguageChange?: LanguagePref;
} {
  const query = userQuery.toLowerCase().trim();
  const roleName = profile?.targetRole ? profile.targetRole.replace("-", " ") : "Tech & Core Engineering";

  // 1. Explicit Language Switch Intent Detection
  if (
    query.includes("english please") ||
    query.includes("speak in english") ||
    query.includes("talk in english") ||
    query.includes("change to english") ||
    query.includes("switch to english") ||
    query === "english" ||
    query === "in english"
  ) {
    return {
      text: "🇬🇧 Switched to English! From now on, I will answer all your questions in English. What would you like to explore next?",
      chips: getMainFeatureChips("en"),
      detectedLanguageChange: "en"
    };
  }

  if (
    query.includes("hinglish please") ||
    query.includes("hindi please") ||
    query.includes("speak in hinglish") ||
    query.includes("talk in hinglish") ||
    query.includes("change to hinglish") ||
    query.includes("switch to hinglish") ||
    query === "hinglish" ||
    query.includes("hindi mein")
  ) {
    return {
      text: "🇮🇳 Hinglish mode active! Ab hum Hinglish mein baat karenge. Batao dost, aage kya help chahiye?",
      chips: getMainFeatureChips("hinglish"),
      detectedLanguageChange: "hinglish"
    };
  }

  const isEn = activeLang === "en";

  // 2. CGPA & College Tier Doubts
  if (
    query.includes("cgpa") ||
    query.includes("gpa") ||
    query.includes("marks") ||
    query.includes("percentage") ||
    query.includes("tier 3") ||
    query.includes("tier 2") ||
    query.includes("backlog")
  ) {
    if (isEn) {
      return {
        text: "Never let your CGPA or college tier hold you back! 85% of off-campus hiring evaluates practical skills, GitHub projects, and problem-solving. Let's optimize your resume and projects to stand out.",
        chips: [
          { id: "c-ats", label: "📄 Check Resume ATS Score", value: "feature_resume" },
          { id: "c-rm", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" }
        ]
      };
    }
    return {
      text: "Tension bilkul mat le dost! 85% off-campus hiring mein CGPA se zyada tere live projects aur coding skills matter karte hain. 2 solid projects bana, tera portfolio bolna chahiye!",
      chips: [
        { id: "c-ats", label: "📄 Resume Check (ATS)", value: "feature_resume" },
        { id: "c-rm", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" }
      ]
    };
  }

  // 3. Resume / ATS Audit Queries
  if (
    query.includes("resume") ||
    query.includes("cv") ||
    query.includes("ats") ||
    query.includes("score") ||
    query.includes("formatting")
  ) {
    if (isEn) {
      return {
        text: `A solid ATS-friendly resume needs clean 1-page formatting, target keywords for ${roleName}, and quantified impact metrics. Let's run a full deterministic 100-point audit!`,
        chips: [
          { id: "c-ats", label: "📄 Upload Resume for ATS Audit", value: "feature_resume" },
          { id: "c-jobs", label: "💼 View Matched Jobs", value: "feature_jobs" }
        ]
      };
    }
    return {
      text: `Resume mein 3 cheezein sabse zaroori hain: clean 1-page format, ${roleName} ke target keywords, aur project numbers. Apna resume upload karo, main turant audit karta hoon!`,
      chips: [
        { id: "c-ats", label: "📄 Resume Check (ATS)", value: "feature_resume" },
        { id: "c-jobs", label: "💼 Job Matches", value: "feature_jobs" }
      ]
    };
  }

  // 4. Roadmap / Learning / Where to Start Queries
  if (
    query.includes("roadmap") ||
    query.includes("learn") ||
    query.includes("study") ||
    query.includes("start") ||
    query.includes("syllabus") ||
    query.includes("course") ||
    query.includes("guide")
  ) {
    if (isEn) {
      return {
        text: `The most effective way to crack ${roleName} is a 3-phase journey: Foundation (Weeks 1-4), Building Production Apps (Weeks 5-8), and Placement Prep (Weeks 9-12). Check out your 90-day roadmap!`,
        chips: [
          { id: "c-rm", label: "🗺️ View 90-Day Roadmap", value: "feature_roadmap" },
          { id: "c-int", label: "🎙️ Practice Mock Interview", value: "feature_interview" }
        ]
      };
    }
    return {
      text: `${roleName} crack karne ka sabse best tareeqa hai step-by-step: pehle foundation fundamentals, phir live production projects, aur aakhiri mahine interview prep. Tera 90-day roadmap check karein?`,
      chips: [
        { id: "c-rm", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" },
        { id: "c-int", label: "🎙️ 5-Min Mock Interview", value: "feature_interview" }
      ]
    };
  }

  // 5. Job Search / Internships / Scams Queries
  if (
    query.includes("job") ||
    query.includes("internship") ||
    query.includes("placement") ||
    query.includes("hiring") ||
    query.includes("apply") ||
    query.includes("salary") ||
    query.includes("scam")
  ) {
    if (isEn) {
      return {
        text: `I have curated verified fresher job openings and internships filtered strictly by skill match. We also auto-flag suspicious upfront payment scams to keep you safe!`,
        chips: [
          { id: "c-jobs", label: "💼 Explore Matched Jobs", value: "feature_jobs" },
          { id: "c-ats", label: "📄 Check Resume Match Score", value: "feature_resume" }
        ]
      };
    }
    return {
      text: `Maine teri skills ke matching verified jobs dhoondh li hain. Aur upfront fees maangne wale scam postings ko heuristics se alert kiya hai taaki tum safe raho!`,
      chips: [
        { id: "c-jobs", label: "💼 Job Matches", value: "feature_jobs" },
        { id: "c-ats", label: "📄 Resume Check (ATS)", value: "feature_resume" }
      ]
    };
  }

  // 6. Interview Preparation / Mock Queries
  if (
    query.includes("interview") ||
    query.includes("mock") ||
    query.includes("question") ||
    query.includes("hr round") ||
    query.includes("technical round")
  ) {
    if (isEn) {
      return {
        text: `Fresher interviews look for clarity, strong fundamental logic, and the STAR framework (Situation → Task → Action → Result). Try our 5-minute timer mock interview to practice!`,
        chips: [
          { id: "c-int", label: "🎙️ Launch 5-Min Mock Interview", value: "feature_interview" },
          { id: "c-rm", label: "🗺️ View Roadmap Topics", value: "feature_roadmap" }
        ]
      };
    }
    return {
      text: `Freshers ke interview mein fundamentals, STAR structure (Situation → Task → Action → Result), aur honest confidence dekha jaata hai. 5-min mock interview try karke report dekho!`,
      chips: [
        { id: "c-int", label: "🎙️ 5-Min Mock Interview", value: "feature_interview" },
        { id: "c-rm", label: "🗺️ 90-Day Roadmap", value: "feature_roadmap" }
      ]
    };
  }

  // 7. Project Ideas / Portfolio Queries
  if (
    query.includes("project") ||
    query.includes("portfolio") ||
    query.includes("github") ||
    query.includes("build")
  ) {
    if (isEn) {
      return {
        text: `Recruiters are impressed by deployed projects with real utility: e.g., a full-stack portal with auth & search, or an analytics dashboard with charts. Avoid generic to-do apps!`,
        chips: [
          { id: "c-rm", label: "🗺️ See Recommended Projects", value: "feature_roadmap" },
          { id: "c-ats", label: "📄 Check Resume Impact", value: "feature_resume" }
        ]
      };
    }
    return {
      text: `Resume ke liye unique utility projects banao: jaise auth aur payment mock wala web app ya analytics dashboard. Generic to-do lists se recruiters impress nahi hote!`,
      chips: [
        { id: "c-rm", label: "🗺️ 90-Day Roadmap Projects", value: "feature_roadmap" },
        { id: "c-ats", label: "📄 Resume Check (ATS)", value: "feature_resume" }
      ]
    };
  }

  // 8. Greetings & Casual Hello
  if (
    query.includes("hi") ||
    query.includes("hello") ||
    query.includes("hey") ||
    query.includes("kaisa") ||
    query.includes("help")
  ) {
    if (isEn) {
      return {
        text: `Hey there! I am your career senior co-pilot. Whether you want to audit your resume ATS score, view your 90-day learning roadmap, or practice a mock interview, I'm here for you!`,
        chips: getMainFeatureChips("en")
      };
    }
    return {
      text: `Hey dost! Main tera senior bhaiya hoon. Chahe resume check karna ho, 90-day roadmap dekhna ho, ya jobs aur mock interview practice karni ho, batao kahan se shuru karein!`,
      chips: getMainFeatureChips("hinglish")
    };
  }

  // 9. Contextual General Fallback
  if (isEn) {
    return {
      text: `I've noted that! For ${roleName}, your strongest next step is to audit your resume for ATS score or follow the 90-day weekly milestones. Which one would you like to tackle?`,
      chips: getMainFeatureChips("en")
    };
  }
  return {
    text: `Maine note kar liya dost! ${roleName} ke liye sabse best next step hai apna resume score check karna ya 90-day weekly milestones follow karna. Kaunsa explore karein?`,
    chips: getMainFeatureChips("hinglish")
  };
}

