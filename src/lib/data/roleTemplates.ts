export interface RoleTemplate {
  id: string;
  title: string;
  category: "Tech" | "Core" | "Non-Tech";
  recommendedBranches: string[];
  primarySkills: string[];
  secondarySkills: string[];
  atsKeywords: string[];
  recommendedProjects: string[];
  interviewTopics: string[];
  descriptionHinglish: string;
  descriptionEnglish: string;
}

export const ROLE_TEMPLATES: Record<string, RoleTemplate> = {
  "software-developer": {
    id: "software-developer",
    title: "Software Developer (Web)",
    category: "Tech",
    recommendedBranches: ["CSE", "IT", "ECE", "BCA"],
    primarySkills: ["JavaScript", "React", "Node.js", "HTML/CSS", "SQL"],
    secondarySkills: ["TypeScript", "Next.js", "Git", "REST APIs", "Tailwind CSS"],
    atsKeywords: ["Full Stack", "React.js", "RESTful APIs", "State Management", "Git", "Database Schema", "Agile", "Responsive Design"],
    recommendedProjects: ["E-commerce Store with Cart & Auth", "Realtime Collaborative Notes App", "Task Kanban Board with Drag & Drop"],
    interviewTopics: ["JavaScript Event Loop & Closures", "React Hooks & Component Lifecycle", "Async/Await & Promises", "REST API Status Codes", "Basic SQL Joins"],
    descriptionHinglish: "Web apps aur modern fullstack systems build karne ka high-growth role.",
    descriptionEnglish: "Build modern web applications, client interfaces, and robust backend APIs."
  },
  "data-analyst": {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Tech",
    recommendedBranches: ["CSE", "IT", "ECE", "BBA", "Other"],
    primarySkills: ["SQL", "Excel", "Python", "PowerBI"],
    secondarySkills: ["Pandas", "Tableau", "Statistics", "Data Cleaning"],
    atsKeywords: ["SQL Queries", "Data Visualization", "Power BI Dashboards", "EDA", "Pivot Tables", "Business Insights", "Data Wrangling"],
    recommendedProjects: ["Sales & Revenue Performance Dashboard", "Customer Churn Prediction Analysis", "E-commerce Metric Explorer"],
    interviewTopics: ["SQL Window Functions & GROUP BY", "Data Cleaning Techniques", "KPI Formulation", "Excel VLOOKUP vs XLOOKUP", "Dashboard Storytelling"],
    descriptionHinglish: "Raw data se business decisions aur attractive visual dashboards banana.",
    descriptionEnglish: "Turn raw business data into actionable dashboards and strategic insights."
  },
  "python-developer": {
    id: "python-developer",
    title: "Python Developer",
    category: "Tech",
    recommendedBranches: ["CSE", "IT", "ECE", "EEE"],
    primarySkills: ["Python", "Django", "FastAPI", "SQL"],
    secondarySkills: ["Flask", "PostgreSQL", "Docker", "PyTest", "Celery"],
    atsKeywords: ["FastAPI", "Django ORM", "Microservices", "Data Pipelines", "Multithreading", "API Integration", "Automated Testing"],
    recommendedProjects: ["Scalable REST API with Auth & Caching", "Automated Web Scraping Pipeline", "Inventory Management System"],
    interviewTopics: ["Python Generators & Decorators", "GIL (Global Interpreter Lock)", "Django ORM vs Raw SQL", "FastAPI Pydantic Validation", "Exception Handling"],
    descriptionHinglish: "Backend APIs, automation scripts aur data pipeline systems Python mein develop karna.",
    descriptionEnglish: "Develop high-performance backend systems, automation scripts, and REST services."
  },
  "qa-test-engineer": {
    id: "qa-test-engineer",
    title: "QA/Test Engineer",
    category: "Tech",
    recommendedBranches: ["CSE", "IT", "ECE", "BCA", "Other"],
    primarySkills: ["Manual Testing", "Selenium", "Java", "SQL"],
    secondarySkills: ["Postman", "Cypress", "Jira", "TestNG", "API Testing"],
    atsKeywords: ["Test Case Design", "Regression Testing", "Selenium WebDriver", "Postman API Automation", "Bug Lifecycle", "Smoke Testing"],
    recommendedProjects: ["Automation Framework for E-commerce App", "Postman API Test Suite with CI Mock", "Bug Tracking Case Study in Jira"],
    interviewTopics: ["SDLC vs STLC", "Severity vs Priority", "Selenium Locators & Waits", "API Response Codes Validation", "Writing Edge-Case Test Scenarios"],
    descriptionHinglish: "Software quality assure karna, bugs dhoondhna aur automation test scripts likhna.",
    descriptionEnglish: "Validate software quality, hunt critical bugs, and build test automation suites."
  },
  "java-developer": {
    id: "java-developer",
    title: "Java Developer",
    category: "Tech",
    recommendedBranches: ["CSE", "IT", "ECE"],
    primarySkills: ["Java", "Spring Boot", "SQL", "Hibernate"],
    secondarySkills: ["Microservices", "Maven", "JUnit", "Docker", "PostgreSQL"],
    atsKeywords: ["Spring Boot", "Enterprise Java", "Hibernate ORM", "JPA", "Microservices Architecture", "Multithreading", "RESTful Web Services"],
    recommendedProjects: ["Banking Transaction Simulator with Spring Boot", "Student Management Portal with JWT Auth", "Online Food Ordering Backend"],
    interviewTopics: ["Core Java OOPs Concepts", "Collections Framework (HashMap internal workings)", "Spring Boot Annotations & DI", "Database Transaction ACID", "Exception Hierarchy"],
    descriptionHinglish: "Enterprise grade, scalable aur stable banking/fintech backend services build karna.",
    descriptionEnglish: "Engineer robust enterprise-grade backend systems and scalable microservices."
  },
  "digital-marketing": {
    id: "digital-marketing",
    title: "Digital Marketing Specialist",
    category: "Non-Tech",
    recommendedBranches: ["BBA", "Other", "CSE", "IT"],
    primarySkills: ["SEO", "Google Ads", "Content Strategy", "Social Media"],
    secondarySkills: ["Google Analytics (GA4)", "Canva", "Meta Ads", "Email Marketing", "Copywriting"],
    atsKeywords: ["Search Engine Optimization", "Google Ads ROI", "Keyword Research", "GA4 Traffic Funnels", "Campaign Optimization", "Conversion Rate"],
    recommendedProjects: ["Live Website SEO Growth Audit", "Paid Meta Ad Campaign Mock Case Study", "Viral Content Strategy Playbook"],
    interviewTopics: ["On-page vs Off-page SEO", "CPC, CPM, and ROAS calculations", "Keyword Intent Classification", "A/B Testing Ad Creatives", "User Acquisition Funnels"],
    descriptionHinglish: "Organic search, ads aur social content se online brand growth aur leads generate karna.",
    descriptionEnglish: "Drive high-converting traffic, optimize paid campaigns, and scale organic brand reach."
  },
  "core-mechanical": {
    id: "core-mechanical",
    title: "Core Mechanical Engineer",
    category: "Core",
    recommendedBranches: ["Mech"],
    primarySkills: ["AutoCAD", "SolidWorks", "Thermodynamics", "Manufacturing Processes"],
    secondarySkills: ["ANSYS", "GD&T", "DFM (Design for Manufacturing)", "Quality Control"],
    atsKeywords: ["3D CAD Modeling", "SolidWorks Assemblies", "FEA Analysis", "GD&T Tolerance", "Lean Manufacturing", "Sheet Metal Design"],
    recommendedProjects: ["Gearbox Redesign & Stress FEA Simulation", "Automated Fixture Design in SolidWorks", "Thermal Heat Exchanger Optimization"],
    interviewTopics: ["Stress-Strain Curve & Yield Strength", "Thermodynamic Cycles (Otto/Diesel)", "GD&T Symbols & Datum Planes", "Machining Tolerances", "Material Selection for Fatigue"],
    descriptionHinglish: "Machinery, automotive parts aur manufacturing systems ka CAD design aur analysis.",
    descriptionEnglish: "Design mechanical assemblies, conduct structural simulations, and optimize production lines."
  },
  "core-civil": {
    id: "core-civil",
    title: "Core Civil Engineer",
    category: "Core",
    recommendedBranches: ["Civil"],
    primarySkills: ["AutoCAD", "STAAD.Pro", "Structural Analysis", "Site Supervision"],
    secondarySkills: ["Revit", "Estimation & Costing", "Surveying", "Concrete Technology"],
    atsKeywords: ["Structural Design", "STAAD.Pro Modeling", "RCC Detailing", "Site Estimation", "BIM Revit", "IS 456 Code Compliance"],
    recommendedProjects: ["G+4 Residential Building Structural Analysis", "Quantity Survey & Cost Estimation Spreadsheet", "Water Drainage Layout Blueprint"],
    interviewTopics: ["Bending Moment vs Shear Force Diagrams", "IS 456 Design Fundamentals", "Soil Bearing Capacity Tests", "Concrete Slump Test & Mix Grades", "Bar Bending Schedules"],
    descriptionHinglish: "Building structures, layout planning aur construction estimation handle karna.",
    descriptionEnglish: "Plan structural layouts, verify load calculations, and manage civil construction sites."
  },
  "core-electrical": {
    id: "core-electrical",
    title: "Core Electrical Engineer",
    category: "Core",
    recommendedBranches: ["EEE", "ECE"],
    primarySkills: ["Circuit Design", "Power Systems", "MATLAB", "PLC/SCADA"],
    secondarySkills: ["Control Systems", "Microcontrollers (Arduino/STM32)", "PCB Design", "Electrical Machines"],
    atsKeywords: ["Power Distribution", "MATLAB Simulink", "PLC Ladder Logic", "Transformer Testing", "Substation Design", "Embedded Microcontrollers"],
    recommendedProjects: ["Smart Energy Meter with Arduino & IoT", "Motor Speed Control Simulation in MATLAB", "PLC Automation for Bottle Filling Plant"],
    interviewTopics: ["Transformer Working & Losses", "Induction Motor Slip & Torque Characteristics", "Three-Phase Power Formulas", "Substation Protection Relays", "Power Factor Correction"],
    descriptionHinglish: "Power distribution, transformer substations aur industrial automation systems manage karna.",
    descriptionEnglish: "Analyze power grid systems, design electrical schematics, and implement automation logic."
  },
  "sales-bda": {
    id: "sales-bda",
    title: "Sales / Business Development Associate",
    category: "Non-Tech",
    recommendedBranches: ["BBA", "Other", "CSE", "ECE", "Mech", "Civil"],
    primarySkills: ["Communication", "Lead Generation", "Negotiation", "CRM Tools"],
    secondarySkills: ["Cold Calling", "Pitch Deck Presentation", "Objection Handling", "Market Research"],
    atsKeywords: ["B2B Prospecting", "Sales Pipeline Management", "Client Pitching", "Revenue Quota Achievement", "HubSpot CRM", "Cold Outreach"],
    recommendedProjects: ["EdTech Sales Pitch & Objection Playbook", "Outreach Script & Mock Cold Call Recordings", "Territory Market Penetration Plan"],
    interviewTopics: ["Handling 'Your price is too high' objection", "SPIN Selling Framework", "Closing Techniques", "Managing High-Rejection Scenarios", "Explaining Customer Lifetime Value"],
    descriptionHinglish: "Prospects se connect karna, pitch dena aur deals close karke business revenue generate karna.",
    descriptionEnglish: "Drive sales pipeline growth, pitch products to prospects, and close high-value deals."
  }
};
