import { ATSScoreBreakdown, ATSMistake, ResumeAnalysisResult } from "../types";
import { ROLE_TEMPLATES } from "../data/roleTemplates";

export function analyzeResumeContent(params: {
  resumeText: string;
  targetRole: string;
  isRegistered?: boolean;
  featureFlagLockMistakes?: boolean;
}): ResumeAnalysisResult {
  const { resumeText, targetRole, isRegistered = false, featureFlagLockMistakes = true } = params;

  const normalized = resumeText.toLowerCase();

  // Safety Check: Detect fabrication requests (e.g. "invent 3 years experience", "make up fake company", "forge degree")
  const fabricationTriggers = [
    "fake experience",
    "fake work experience",
    "invent experience",
    "fake company",
    "lie about",
    "fabricate",
    "forge",
    "fake references",
    "fake degree"
  ];
  const isFabricationAttempt = fabricationTriggers.some(t => normalized.includes(t));

  if (isFabricationAttempt) {
    return {
      score: 30,
      breakdown: {
        formatting: 10,
        keywordMatch: 5,
        quantifiedImpact: 5,
        sectionCompleteness: 5,
        lengthAndClarity: 5,
        totalScore: 30
      },
      verdict: "⚠️ Senior advice: Experience fabricate karne se interview ya background check mein reject ho jaoge. Honest real projects aur certifications add karo, hum guide karenge!",
      mistakes: [
        {
          id: 1,
          title: "Unverified / Fabricated Experience Detected",
          whatIsWrong: "Resume contains unverified claims or attempts to invent job tenure.",
          whyItHurts: "Tech recruiters cross-verify via PF records and GitHub commit histories. Fake claims lead to permanent blacklisting.",
          howToFix: "Replace fabricated claims with genuine high-impact open-source contributions, hackathon demos, or university mini-projects.",
          beforeExample: "3 Years Experience as Senior Architect at Tech Giant (when in college).",
          afterExample: "Built full-stack e-commerce app with 1,000+ mock users and documented architecture on GitHub."
        },
        {
          id: 2,
          title: "Missing Production Proof / Live Links",
          whatIsWrong: "Projects lack verifiable live URLs, GitHub repositories, or demo videos.",
          whyItHurts: "Recruiters cannot verify your actual coding skills without working links.",
          howToFix: "Deploy apps on Vercel/Render and put clickable GitHub repositories.",
          beforeExample: "Library Management System in Java.",
          afterExample: "Library Management System: Built in Spring Boot & PostgreSQL with Docker (Live: app.link, GitHub: repo.link)."
        },
        {
          id: 3,
          title: "No Concrete Skill Evidence",
          whatIsWrong: "Skills listed as raw words without showing where they were applied.",
          whyItHurts: "ATS flags keyword stuffing if the skills are not supported in project bullets.",
          howToFix: "Weave each primary skill into bullet points showing real usage.",
          beforeExample: "Skills: Java, Spring Boot, React, SQL, AWS, Kubernetes, Docker.",
          afterExample: "Developed 12 Spring Boot REST endpoints consumed by React frontend with PostgreSQL DB."
        }
      ],
      targetRole,
      matchedKeywords: [],
      missingKeywords: ["Authentic Projects", "GitHub Repositories"],
      analyzedAt: new Date().toISOString()
    };
  }

  // 1. Target Role & Keywords Match (Max 30)
  const roleTemplate = ROLE_TEMPLATES[targetRole] || ROLE_TEMPLATES["software-developer"];
  const expectedKeywords = roleTemplate.atsKeywords.map(k => k.toLowerCase());
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of expectedKeywords) {
    if (normalized.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const keywordRatio = expectedKeywords.length > 0 ? matchedKeywords.length / expectedKeywords.length : 0.5;
  const keywordMatchScore = Math.min(30, Math.round(keywordRatio * 30));

  // 2. Formatting & Parseability (Max 20)
  let formattingScore = 14;
  if (normalized.includes("education") && normalized.includes("skills")) formattingScore += 3;
  if (!normalized.includes("table") && !normalized.includes("column")) formattingScore += 3;

  // 3. Quantified Impact (Max 20)
  // Check for metrics (%, numbers, X ms, scale, users, ₹, $)
  const numbersRegex = /\b\d+(\.\d+)?(%|ms|s|k|x|\+)?\b/g;
  const metricsFound = (normalized.match(numbersRegex) || []).length;
  let quantifiedScore = 8;
  if (metricsFound >= 3) quantifiedScore = 14;
  if (metricsFound >= 6) quantifiedScore = 20;

  // 4. Section Completeness (Max 15)
  const requiredSections = ["education", "skills", "projects", "experience"];
  let sectionsFound = 0;
  for (const s of requiredSections) {
    if (normalized.includes(s)) sectionsFound++;
  }
  const sectionCompletenessScore = Math.round((sectionsFound / requiredSections.length) * 15);

  // 5. Length & Clarity (Max 15)
  const wordCount = resumeText.trim().split(/\s+/).length;
  let lengthClarityScore = 10;
  if (wordCount >= 150 && wordCount <= 700) {
    lengthClarityScore = 15; // Ideal 1-page length for college freshers
  } else if (wordCount > 700) {
    lengthClarityScore = 11; // Too long for a fresher
  } else {
    lengthClarityScore = 8; // Too brief
  }

  // Total Score
  const totalScore = Math.min(100, formattingScore + keywordMatchScore + quantifiedScore + sectionCompletenessScore + lengthClarityScore);

  const breakdown: ATSScoreBreakdown = {
    formatting: formattingScore,
    keywordMatch: keywordMatchScore,
    quantifiedImpact: quantifiedScore,
    sectionCompleteness: sectionCompletenessScore,
    lengthAndClarity: lengthClarityScore,
    totalScore
  };

  // Friendly Senior Verdict
  let verdict = "Solid start, dost! Minor tweaks karoge toh shortlist hone ke chances 3x ho jayenge.";
  if (totalScore >= 80) {
    verdict = "Shaandar resume hai! ATS filter aasaani se clear ho jayega, bas project impact highlight karo.";
  } else if (totalScore < 60) {
    verdict = "Abhi resume thoda generic lag raha hai. Par tension mat lo — neeche diye 3 fixes se score 80+ pahunch jayega!";
  }

  // Exactly 3 Fixable Mistakes (Contract Requirement per PRD)
  const shouldLock = !isRegistered && featureFlagLockMistakes;

  const mistakes: ATSMistake[] = [
    {
      id: 1,
      title: "Projects Lack Quantified Metrics & Business Impact",
      whatIsWrong: "Project description sirf features batati hai, result ya scale nahi.",
      whyItHurts: "ATS aur hiring managers numbers dhoondhte hain (e.g. 'reduced latency by 40%', 'served 200 users'). Bina metrics ke resume generic lagta hai.",
      howToFix: "Har project bullet mein action verb + tech used + measurable outcome (numbers/percentages) add karo.",
      beforeExample: "Built an e-commerce website using React and Node.js with login and checkout features.",
      afterExample: "Engineered responsive full-stack e-commerce app with React & Node.js, achieving sub-200ms API response times and handling 50+ concurrent cart checkouts.",
      isLocked: false // Always unlocked for preview
    },
    {
      id: 2,
      title: `Missing High-Priority ATS Keywords for ${roleTemplate.title}`,
      whatIsWrong: `Target role ke essential keywords missing hain: ${missingKeywords.slice(0, 3).join(", ") || "RESTful APIs, State Management, Git"}.`,
      whyItHurts: "ATS scanner initial filter mein keyword frequency check karta hai. Ye words na hone par resume auto-reject ho sakta hai.",
      howToFix: `Apne skills aur project descriptions mein missing terms (${missingKeywords.slice(0, 2).join(", ") || "REST APIs, Git"}) natural tareeqe se include karo.`,
      beforeExample: "Worked on website coding and backend data storage.",
      afterExample: "Architected RESTful APIs with Node.js & PostgreSQL, integrating automated Git CI/CD pipelines.",
      isLocked: shouldLock
    },
    {
      id: 3,
      title: "Passive Bullet Points instead of Strong Action Verbs",
      whatIsWrong: "Bullets shuru hote hain 'Responsible for...', 'Helped in...', 'Worked with...'.",
      whyItHurts: "Ye passive lagta hai aur interviewer ko lagta hai tumne lead nahi kiya, bas assist kiya.",
      howToFix: "Strong engineering verbs se start karo: 'Architected', 'Implemented', 'Optimized', 'Automated'.",
      beforeExample: "Responsible for creating database tables and fixing frontend bugs.",
      afterExample: "Optimized relational database schemas with indexed queries and resolved 15+ frontend rendering bugs in React.",
      isLocked: shouldLock
    }
  ];

  return {
    score: totalScore,
    breakdown,
    verdict,
    mistakes,
    targetRole: roleTemplate.title,
    matchedKeywords,
    missingKeywords,
    analyzedAt: new Date().toISOString()
  };
}
