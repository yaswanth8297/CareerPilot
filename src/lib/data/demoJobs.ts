import { JobListing } from "../types";

export const DEMO_JOBS: JobListing[] = [
  // 1. Web / Frontend
  {
    id: "job-01",
    title: "Junior Frontend Developer (React)",
    company: "ZetaScale Tech",
    location: "Bengaluru (Hybrid)",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 92,
    whyItMatches: "Strong match with React, JavaScript, and HTML/CSS portfolio projects.",
    matchedSkills: ["React", "JavaScript", "HTML/CSS", "Git"],
    missingSkills: ["Tailwind CSS", "TypeScript"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://careers.zetascale.example.com/apply/frontend-fresher",
    postedDate: "2 days ago",
    salaryRange: "₹4.5 - ₹6.5 LPA"
  },
  {
    id: "job-02",
    title: "Web Development Intern",
    company: "NextWave Cloud Solutions",
    location: "Remote",
    isRemote: true,
    jobType: "Internship",
    matchPercent: 88,
    whyItMatches: "Accepts 2nd/3rd year students. Practical React & API knowledge required.",
    matchedSkills: ["JavaScript", "HTML/CSS", "REST APIs"],
    missingSkills: ["Next.js"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://nextwave.example.com/internships/web-2026",
    postedDate: "1 day ago",
    salaryRange: "₹18,000 - ₹25,000/month"
  },
  {
    id: "job-03",
    title: "Software Engineer Trainee",
    company: "Apex Global Consulting",
    location: "Hyderabad",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 84,
    whyItMatches: "Focuses on computer science fundamentals and basic web programming.",
    matchedSkills: ["JavaScript", "SQL", "Git"],
    missingSkills: ["Docker"],
    minCgpaRequired: 8.5,
    hasCgpaFilter: true, // Flagged per PRD
    isScamSuspicious: false,
    applyUrl: "https://apexconsulting.example.com/careers/trainee",
    postedDate: "3 days ago",
    salaryRange: "₹5.0 - ₹7.0 LPA"
  },

  // 2. Data Analyst
  {
    id: "job-04",
    title: "Associate Data Analyst",
    company: "FinMetrics Analytics",
    location: "Pune / Remote",
    isRemote: true,
    jobType: "Fresher",
    matchPercent: 94,
    whyItMatches: "Perfect fit for SQL, Excel pivot tables, and dashboard reporting.",
    matchedSkills: ["SQL", "Excel", "PowerBI"],
    missingSkills: ["Python (Pandas)"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://finmetrics.example.com/jobs/associate-data-analyst",
    postedDate: "Just now",
    salaryRange: "₹4.0 - ₹6.0 LPA"
  },
  {
    id: "job-05",
    title: "Business Intelligence Intern",
    company: "CartPulse E-Commerce",
    location: "Gurugram",
    isRemote: false,
    jobType: "Internship",
    matchPercent: 89,
    whyItMatches: "Hands-on role building sales dashboards and data cleaning pipelines.",
    matchedSkills: ["Excel", "SQL"],
    missingSkills: ["Tableau"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://cartpulse.example.com/interns/bi-analyst",
    postedDate: "4 days ago",
    salaryRange: "₹20,000/month"
  },

  // 3. Python Developer
  {
    id: "job-06",
    title: "Backend Engineer (Python / FastAPI)",
    company: "HyperLogic Systems",
    location: "Bengaluru",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 91,
    whyItMatches: "Core Python REST API development and relational database management.",
    matchedSkills: ["Python", "SQL", "FastAPI"],
    missingSkills: ["PostgreSQL", "Docker"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://hyperlogic.example.com/apply/py-eng",
    postedDate: "2 days ago",
    salaryRange: "₹5.5 - ₹8.0 LPA"
  },
  {
    id: "job-07",
    title: "Python Automation Intern",
    company: "DataSprint Labs",
    location: "Remote",
    isRemote: true,
    jobType: "Internship",
    matchPercent: 86,
    whyItMatches: "Writing web scraping scripts and background automated tasks.",
    matchedSkills: ["Python"],
    missingSkills: ["Selenium", "BeautifulSoup"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://datasprint.example.com/intern/python",
    postedDate: "5 days ago",
    salaryRange: "₹15,000/month"
  },

  // 4. Java Developer
  {
    id: "job-08",
    title: "Graduate Engineer Trainee - Java",
    company: "PayShield Technologies",
    location: "Chennai",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 93,
    whyItMatches: "Core Java OOPs proficiency and familiarity with Spring Boot microservices.",
    matchedSkills: ["Java", "SQL", "Spring Boot"],
    missingSkills: ["Hibernate", "Microservices"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://payshield.example.com/trainee/java",
    postedDate: "3 days ago",
    salaryRange: "₹4.8 - ₹6.8 LPA"
  },
  {
    id: "job-09",
    title: "Backend Java Developer Intern",
    company: "InfraGrid Solutions",
    location: "Noida",
    isRemote: false,
    jobType: "Internship",
    matchPercent: 85,
    whyItMatches: "Supports backend API development and JUnit automated testing.",
    matchedSkills: ["Java", "SQL"],
    missingSkills: ["Maven", "Spring Boot"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://infragrid.example.com/careers/java-intern",
    postedDate: "1 week ago",
    salaryRange: "₹22,000/month"
  },

  // 5. QA / Test Engineer
  {
    id: "job-10",
    title: "QA Automation Engineer (Fresher)",
    company: "TestCraft Software",
    location: "Hyderabad / Remote",
    isRemote: true,
    jobType: "Fresher",
    matchPercent: 90,
    whyItMatches: "Test scenario design, Selenium test scripts, and regression verification.",
    matchedSkills: ["Manual Testing", "Selenium", "Java", "SQL"],
    missingSkills: ["Postman", "Cypress"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://testcraft.example.com/openings/qa-fresher",
    postedDate: "2 days ago",
    salaryRange: "₹3.8 - ₹5.5 LPA"
  },
  {
    id: "job-11",
    title: "Software Quality Analyst Intern",
    company: "AppVantage Studio",
    location: "Bengaluru",
    isRemote: false,
    jobType: "Internship",
    matchPercent: 87,
    whyItMatches: "Writing detailed test cases and bug logging in Jira.",
    matchedSkills: ["Manual Testing", "Communication"],
    missingSkills: ["Selenium"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://appvantage.example.com/interns/qa",
    postedDate: "3 days ago",
    salaryRange: "₹16,000/month"
  },

  // 6. Digital Marketing
  {
    id: "job-12",
    title: "SEO & Growth Associate",
    company: "RankBoost Media",
    location: "Delhi NCR",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 92,
    whyItMatches: "Keyword analysis, on-page SEO audits, and content planning.",
    matchedSkills: ["SEO", "Content Strategy", "Social Media"],
    missingSkills: ["Google Ads", "GA4"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://rankboost.example.com/apply/growth",
    postedDate: "4 days ago",
    salaryRange: "₹3.5 - ₹5.0 LPA"
  },
  {
    id: "job-13",
    title: "Performance Marketing Trainee",
    company: "ViralVibe Studios",
    location: "Remote",
    isRemote: true,
    jobType: "Internship",
    matchPercent: 88,
    whyItMatches: "Hands-on experience managing Google Ads search campaigns and ad copy.",
    matchedSkills: ["Google Ads", "Social Media"],
    missingSkills: ["Meta Ads", "A/B Testing"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://viralvibe.example.com/careers/trainee",
    postedDate: "1 day ago",
    salaryRange: "₹18,000/month"
  },

  // 7. Core Mechanical
  {
    id: "job-14",
    title: "Graduate Mechanical Design Trainee",
    company: "AeroMech Components Ltd",
    location: "Pune",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 91,
    whyItMatches: "CAD drawing preparation and SolidWorks assembly design.",
    matchedSkills: ["AutoCAD", "SolidWorks", "Thermodynamics"],
    missingSkills: ["ANSYS", "GD&T"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://aeromech.example.com/jobs/design-trainee",
    postedDate: "5 days ago",
    salaryRange: "₹3.6 - ₹5.2 LPA"
  },
  {
    id: "job-15",
    title: "Production Planning Engineer Trainee",
    company: "Bharat Heavy Equipments",
    location: "Coimbatore",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 86,
    whyItMatches: "Shop-floor production workflows and quality inspection.",
    matchedSkills: ["Manufacturing Processes", "AutoCAD"],
    missingSkills: ["DFM", "Lean Manufacturing"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://bhe-equipments.example.com/apply/production-trainee",
    postedDate: "1 week ago",
    salaryRange: "₹3.2 - ₹4.5 LPA"
  },

  // 8. Core Civil
  {
    id: "job-16",
    title: "Junior Structural Engineer",
    company: "Infrabuild Consultants",
    location: "Ahmedabad",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 89,
    whyItMatches: "RCC detailing and structural analysis using STAAD.Pro.",
    matchedSkills: ["AutoCAD", "STAAD.Pro", "Structural Analysis"],
    missingSkills: ["Revit", "Estimation"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://infrabuild.example.com/careers/jr-structural",
    postedDate: "3 days ago",
    salaryRange: "₹3.5 - ₹4.8 LPA"
  },
  {
    id: "job-17",
    title: "Site Engineer Trainee",
    company: "Apex Infra Projects",
    location: "Kolkata",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 84,
    whyItMatches: "Site inspection, concrete mix monitoring, and daily reporting.",
    matchedSkills: ["Site Supervision", "AutoCAD"],
    missingSkills: ["Quantity Surveying"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://apexinfra.example.com/jobs/site-trainee",
    postedDate: "6 days ago",
    salaryRange: "₹3.0 - ₹4.2 LPA"
  },

  // 9. Core Electrical
  {
    id: "job-18",
    title: "Industrial Automation Engineer Trainee",
    company: "VoltCraft Controls",
    location: "Vadodara",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 90,
    whyItMatches: "PLC programming and electrical control panel wiring.",
    matchedSkills: ["Circuit Design", "PLC/SCADA", "Power Systems"],
    missingSkills: ["MATLAB", "Microcontrollers"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://voltcraft.example.com/openings/automation",
    postedDate: "2 days ago",
    salaryRange: "₹3.8 - ₹5.4 LPA"
  },
  {
    id: "job-19",
    title: "Electrical Maintenance Trainee",
    company: "SunGrid Energy Power",
    location: "Jaipur",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 85,
    whyItMatches: "Substation equipment maintenance and transformer testing.",
    matchedSkills: ["Power Systems", "Circuit Design"],
    missingSkills: ["PLC"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://sungrid.example.com/careers/maintenance",
    postedDate: "4 days ago",
    salaryRange: "₹3.2 - ₹4.6 LPA"
  },

  // 10. Sales / BDA
  {
    id: "job-20",
    title: "Business Development Trainee",
    company: "GrowthPioneer Edutech",
    location: "Noida / Gurugram",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 93,
    whyItMatches: "High-energy sales prospecting, lead qualification, and product demos.",
    matchedSkills: ["Communication", "Lead Generation", "Negotiation"],
    missingSkills: ["CRM Tools"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://growthpioneer.example.com/careers/bdt",
    postedDate: "1 day ago",
    salaryRange: "₹4.5 - ₹7.5 LPA (incl. incentives)"
  },
  {
    id: "job-21",
    title: "Inside Sales Representative Intern",
    company: "SaaSLink Global",
    location: "Remote",
    isRemote: true,
    jobType: "Internship",
    matchPercent: 88,
    whyItMatches: "Outbound prospect communication and scheduling discovery calls.",
    matchedSkills: ["Communication"],
    missingSkills: ["Cold Calling", "HubSpot"],
    hasCgpaFilter: false,
    isScamSuspicious: false,
    applyUrl: "https://saaslink.example.com/interns/inside-sales",
    postedDate: "3 days ago",
    salaryRange: "₹20,000/month + bonuses"
  },

  // 11. SCAM / SUSPICIOUS EXAMPLES (Per PRD Heuristics)
  {
    id: "job-22-scam",
    title: "Work From Home Data Entry / Chat Assistant (Immediate Joining)",
    company: "QuickEarn Global Careers",
    location: "Remote",
    isRemote: true,
    jobType: "Fresher",
    matchPercent: 40,
    whyItMatches: "Basic typing and English.",
    matchedSkills: ["Communication"],
    missingSkills: ["SQL", "Excel"],
    hasCgpaFilter: false,
    isScamSuspicious: true,
    scamReasons: [
      "Asks for ₹2,500 'Security Deposit' or 'Laptop Processing Fee' before onboarding",
      "Company uses free Gmail address (quickearnhr@gmail.com) instead of corporate domain",
      "Unrealistic salary promise for zero technical qualifications"
    ],
    applyUrl: "https://suspicious-free-form.example.org/pay-deposit",
    postedDate: "Today",
    salaryRange: "₹45,000/month (Fixed upfront deposit required)"
  },
  {
    id: "job-23-scam",
    title: "Executive Trainee - 100% Guaranteed Foreign Placement",
    company: "Global Star Placement Agency",
    location: "Remote / Overseas",
    isRemote: true,
    jobType: "Fresher",
    matchPercent: 35,
    whyItMatches: "Any degree fresher.",
    matchedSkills: [],
    missingSkills: ["Relevant Core Skills"],
    hasCgpaFilter: false,
    isScamSuspicious: true,
    scamReasons: [
      "Claims 100% foreign placement guarantee on non-verified domain",
      "Requires applicant to purchase mandatory training material worth ₹4,999"
    ],
    applyUrl: "https://fake-placement-guarantee.example.org/apply",
    postedDate: "Yesterday",
    salaryRange: "₹35 LPA (Warning: High scam pattern)"
  },

  // 12. HIGH CGPA SENSITIVE EXAMPLES (Flagged, not hidden per PRD)
  {
    id: "job-24-cgpa",
    title: "Systems Engineer Trainee",
    company: "Premier Core Technologies",
    location: "Bengaluru",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 86,
    whyItMatches: "C++ and systems programming requirements match.",
    matchedSkills: ["C++", "SQL"],
    missingSkills: ["Operating Systems", "Linux"],
    minCgpaRequired: 8.5,
    hasCgpaFilter: true,
    isScamSuspicious: false,
    applyUrl: "https://premiercore.example.com/apply/systems",
    postedDate: "4 days ago",
    salaryRange: "₹7.0 - ₹9.0 LPA"
  },
  {
    id: "job-25-cgpa",
    title: "Associate Product Specialist",
    company: "Tier 1 Consulting Group",
    location: "Mumbai",
    isRemote: false,
    jobType: "Fresher",
    matchPercent: 82,
    whyItMatches: "Analytical thinking and client communication.",
    matchedSkills: ["Excel", "Communication"],
    missingSkills: ["Market Modeling"],
    minCgpaRequired: 9.0,
    hasCgpaFilter: true,
    isScamSuspicious: false,
    applyUrl: "https://tier1consulting.example.com/apply",
    postedDate: "5 days ago",
    salaryRange: "₹8.5 - ₹11.0 LPA"
  }
];

export function filterAndRankJobs(params: {
  targetRole?: string;
  userSkills?: string[];
  jobType?: string;
  remoteOnly?: boolean;
}): JobListing[] {
  const { targetRole, userSkills = [], jobType, remoteOnly } = params;

  let filtered = [...DEMO_JOBS];

  if (jobType && jobType !== "all") {
    filtered = filtered.filter(j => j.jobType.toLowerCase() === jobType.toLowerCase());
  }

  if (remoteOnly) {
    filtered = filtered.filter(j => j.isRemote);
  }

  // Calculate dynamic skill match score without considering CGPA or college tier (Fairness guarantee)
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());

  const scored = filtered.map(job => {
    if (job.isScamSuspicious) return job; // Keep scam match low

    const matchedCount = job.matchedSkills.filter(s =>
      normalizedUserSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    ).length;

    const baseMatch = job.matchPercent || 75;
    // Boost slightly if user has matched skills
    const adjustedMatch = Math.min(98, Math.max(60, baseMatch + (matchedCount > 0 ? 5 : -5)));

    return {
      ...job,
      matchPercent: adjustedMatch
    };
  });

  // Sort: non-scams first by match percent descending, scams at the bottom with clear flags
  return scored.sort((a, b) => {
    if (a.isScamSuspicious && !b.isScamSuspicious) return 1;
    if (!a.isScamSuspicious && b.isScamSuspicious) return -1;
    return b.matchPercent - a.matchPercent;
  });
}
