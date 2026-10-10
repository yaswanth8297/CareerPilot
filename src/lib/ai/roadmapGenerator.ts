import { RoadmapData, RoadmapWeek, StudentYear } from "../types";
import { ROLE_TEMPLATES } from "../data/roleTemplates";
import { CURATED_RESOURCES, getResourcesForRole } from "../data/curatedResources";

export function generatePersonalizedRoadmap(params: {
  targetRoleKey: string;
  userSkills: string[];
  year: StudentYear;
  isRegistered?: boolean;
}): RoadmapData {
  const { targetRoleKey, userSkills, year, isRegistered = false } = params;

  const role = ROLE_TEMPLATES[targetRoleKey] || ROLE_TEMPLATES["software-developer"];
  const vettedResources = getResourcesForRole(role.id, 10);
  const fallbackResource = CURATED_RESOURCES[0];

  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());

  // Week generator: 12 weeks grouped into 3 phases: Foundation (w1-w4), Build (w5-w8), Job Ready (w9-w12)
  const weeks: RoadmapWeek[] = [];

  // Phase 1: Foundation (Weeks 1 - 4)
  const p1Topics = [
    {
      title: "Core Fundamentals & Tooling",
      desc: "Programming syntax, command line basics, Git setup and environment configuration.",
      topics: [role.primarySkills[0] || "Programming Syntax", "Git & GitHub Setup", "Terminal & Dev Tools"],
      task: "Set up GitHub profile and push your first clean project repository with a README."
    },
    {
      title: "Key Language Deep-Dive & Data Structures",
      desc: "Control flow, object modeling, array manipulations, and asynchronous concepts.",
      topics: [role.primarySkills[1] || "Core Concepts", "Algorithms & Logic", "Error Handling"],
      task: "Write 5 problem-solving scripts and test edge-case inputs."
    },
    {
      title: "Architecture & Data Management",
      desc: "Databases, schema normalization, SQL queries, or state management.",
      topics: [role.primarySkills[2] || "Databases & SQL", "CRUD Operations", "Data Modeling"],
      task: "Design a relational schema with at least 3 linked tables and run join queries."
    },
    {
      title: "Foundation Milestone Project",
      desc: "Putting the initial fundamentals together in a working prototype.",
      topics: ["End-to-end integration", "Code Modularization", "Debugging"],
      task: `Build MVP 1: ${role.recommendedProjects[0] || "Starter Utility Tool"}.`
    }
  ];

  // Phase 2: Build (Weeks 5 - 8)
  const p2Topics = [
    {
      title: "Advanced Frameworks & APIs",
      desc: "Modern frameworks, RESTful API design, and component architecture.",
      topics: [role.secondarySkills[0] || "Modern Framework", "API Integration", "Routing"],
      task: "Create 4 connected API endpoints with request validation."
    },
    {
      title: "State, Caching & Performance",
      desc: "Global state, caching patterns, query optimization, and latency tuning.",
      topics: ["Caching", "Async Queues / Workers", "Query Indexing"],
      task: "Profile API response times and optimize slow database queries."
    },
    {
      title: "Security, Authentication & Testing",
      desc: "User auth tokens, role permissions, test suites, and regression checks.",
      topics: ["JWT / Sessions", "Unit Testing", "Input Sanitization"],
      task: "Write automated unit tests covering happy paths and failure scenarios."
    },
    {
      title: "Flagship Production Project",
      desc: "Deploy a full-stack, enterprise-ready project with live demo and documentation.",
      topics: ["Production Deployment", "Vercel / Cloud Setup", "Environment Config"],
      task: `Build & Deploy: ${role.recommendedProjects[1] || "Production Application"}.`
    }
  ];

  // Phase 3: Job Ready (Weeks 9 - 12)
  const p3Topics = [
    {
      title: "Resume & Portfolio Optimization",
      desc: "Incorporate quantified metrics into project bullets and pass ATS benchmarks.",
      topics: ["ATS Keyword Alignment", "Portfolio Site", "GitHub Clean-up"],
      task: "Run CareerPilot ATS checker and get score above 85+ points."
    },
    {
      title: "System Design & Technical Interview Prep",
      desc: "Practice frequently asked technical and DSA/conceptual interview questions.",
      topics: role.interviewTopics.slice(0, 3),
      task: "Solve and record explanations for 5 core technical interview questions."
    },
    {
      title: "5-Minute Mock Interviews & HR Behavioral",
      desc: "Practice answering using the STAR method (Situation, Task, Action, Result).",
      topics: ["STAR Method", "Weakness / Conflict Handling", "Salary Negotiation Basics"],
      task: "Complete 2 CareerPilot Mock Interview sessions with score 8+/10."
    },
    {
      title: "Targeted Job Applications & Cold Outreach",
      desc: "Strategic outreach on LinkedIn, applying to filtered jobs, and direct HR messaging.",
      topics: ["Cold Outreach Email/DM", "Job Board Filtering", "Follow-up Cadence"],
      task: "Apply to 10 verified fresher openings and send 5 personalized senior outreach messages."
    }
  ];

  const allPhaseData = [
    { phase: "Foundation" as const, items: p1Topics, weekOffset: 1 },
    { phase: "Build" as const, items: p2Topics, weekOffset: 5 },
    { phase: "Job Ready" as const, items: p3Topics, weekOffset: 9 }
  ];

  let weekCounter = 1;
  for (const group of allPhaseData) {
    for (let i = 0; i < group.items.length; i++) {
      const item = group.items[i];
      const resource = vettedResources[weekCounter % vettedResources.length] || fallbackResource;

      // PRD Gating Rule: Weeks 1 & 2 are unlocked for guests. Weeks 3-12 are locked before registration!
      const isLocked = !isRegistered && weekCounter > 2;

      weeks.push({
        weekNumber: weekCounter,
        phase: group.phase,
        title: item.title,
        description: item.desc,
        topics: item.topics,
        tasks: [
          {
            id: `task-w${weekCounter}-1`,
            title: item.task,
            completed: false,
            estMinutes: 90
          },
          {
            id: `task-w${weekCounter}-2`,
            title: `Review vetted guide: ${resource.title}`,
            completed: false,
            estMinutes: 45
          }
        ],
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceUrl: resource.url,
        isLocked
      });
      weekCounter++;
    }
  }

  return {
    role: role.title,
    phaseNames: [
      "Phase 1: Foundation (Days 1-30)",
      "Phase 2: Build & Production (Days 31-60)",
      "Phase 3: Job Ready & Placements (Days 61-90)"
    ],
    weeks,
    totalWeeks: 12,
    progressPercent: 0
  };
}
