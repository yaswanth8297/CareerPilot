import { InterviewQuestion } from "../types";

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // 1. General Intro (Common to all)
  {
    id: "q-intro-01",
    role: "all",
    category: "Introduction",
    questionHinglish: "Apne baare mein thoda batao — your education, key technical projects, aur tum is role ke liye kyu excited ho?",
    questionEnglish: "Tell me about yourself — your educational background, key projects, and why you are excited about this role?",
    expectedKeywords: ["Education", "Branch", "Projects", "Skills", "Motivation", "Career goal"],
    sampleIdealAnswer: "I'm a final-year CSE student passionate about web engineering. Recently, I built an e-commerce platform with React and Node.js that handled user authentication and cart persistence. I love building responsive apps and want to solve real-world product challenges here."
  },
  {
    id: "q-intro-02",
    role: "all",
    category: "Introduction",
    questionHinglish: "College mein tumhara sabse favourite project kaunsa tha aur usmein tumhara individual contribution kya tha?",
    questionEnglish: "Which was your favorite project in college and what was your specific individual contribution?",
    expectedKeywords: ["Project title", "Tech stack", "Role", "Architecture", "Learning", "Outcome"],
    sampleIdealAnswer: "My standout project was a collaborative task management app. I owned the backend REST API development in Node.js and database schema in MongoDB, ensuring snappy sub-100ms API response times."
  },

  // 2. Web / Software Developer Questions
  {
    id: "q-web-01",
    role: "software-developer",
    category: "Technical",
    questionHinglish: "JavaScript mein 'var', 'let', aur 'const' mein main difference kya hai, aur hoisting kaise behave karti hai?",
    questionEnglish: "What is the key difference between var, let, and const in JavaScript, and how does hoisting affect them?",
    expectedKeywords: ["Scope", "Block scope", "Function scope", "Temporal Dead Zone", "Reassignment"],
    sampleIdealAnswer: "'var' is function-scoped and hoisted initialized with undefined. 'let' and 'const' are block-scoped and hoisted into the Temporal Dead Zone (TDZ), meaning accessing them before declaration throws a ReferenceError. 'const' additionally prevents reassigning the variable binding."
  },
  {
    id: "q-web-02",
    role: "software-developer",
    category: "Technical",
    questionHinglish: "React mein Virtual DOM kya hota hai aur reconciliation process kaise kaam karta hai?",
    questionEnglish: "What is the Virtual DOM in React, and how does the reconciliation diffing algorithm work?",
    expectedKeywords: ["In-memory representation", "Diffing algorithm", "Re-render", "Batching", "Fiber"],
    sampleIdealAnswer: "The Virtual DOM is an in-memory lightweight representation of the real DOM. When state changes, React creates a new VDOM tree, diffs it with the previous tree (Reconciliation), and batch-updates only the changed nodes in the real DOM for high rendering performance."
  },
  {
    id: "q-web-03",
    role: "software-developer",
    category: "Technical",
    questionHinglish: "REST API design karte waqt GET aur POST mein kya farak hai, aur idempotency ka kya matlab hai?",
    questionEnglish: "What is the difference between GET and POST in REST APIs, and what does idempotency mean?",
    expectedKeywords: ["Idempotent", "Safe", "Request body", "Caching", "Side effects"],
    sampleIdealAnswer: "GET retrieves resources, is safe and idempotent (calling it multiple times produces the same server state). POST creates resources, sends data in the request body, and is non-idempotent because repeating it creates multiple new records."
  },
  {
    id: "q-web-04",
    role: "software-developer",
    category: "Technical",
    questionHinglish: "Web page load time fast karne ke liye tum kaunse frontend optimization techniques use karoge?",
    questionEnglish: "Which frontend optimization techniques would you use to improve web page load speed?",
    expectedKeywords: ["Lazy loading", "Code splitting", "Image optimization", "Bundling", "CDN", "Caching"],
    sampleIdealAnswer: "I would implement route-based code splitting, lazy-load heavy offscreen images and components, compress assets (WebP/Brotli), leverage browser caching headers, and minimize bundle size with tree-shaking."
  },
  {
    id: "q-web-05",
    role: "software-developer",
    category: "Project",
    questionHinglish: "Apne web project mein agar users ko login session maintain karna ho, toh JWT ya Session cookies kaise implement karoge?",
    questionEnglish: "In your web project, how do you manage user authentication and session persistence securely?",
    expectedKeywords: ["JWT", "HttpOnly Cookie", "Access token", "Refresh token", "CSRF", "XSS"],
    sampleIdealAnswer: "I store signed JWT access tokens with short expiry, and long-lived refresh tokens inside secure, HttpOnly, SameSite cookies to protect against XSS and CSRF attacks."
  },

  // 3. Data Analyst Questions
  {
    id: "q-data-01",
    role: "data-analyst",
    category: "Technical",
    questionHinglish: "SQL mein WHERE clause aur HAVING clause mein kya antar hota hai?",
    questionEnglish: "What is the difference between the WHERE clause and HAVING clause in SQL?",
    expectedKeywords: ["Aggregation", "GROUP BY", "Row filter", "Aggregate filter", "Order of execution"],
    sampleIdealAnswer: "WHERE filters rows before any grouping or aggregation takes place. HAVING filters groups after the GROUP BY clause and aggregate functions (like SUM, COUNT, AVG) have been evaluated."
  },
  {
    id: "q-data-02",
    role: "data-analyst",
    category: "Technical",
    questionHinglish: "Real-world dataset mein missing values ya outliers ko identify aur clean karne ki tumhari approach kya hoti hai?",
    questionEnglish: "How do you handle missing values and outliers in a real-world messy dataset?",
    expectedKeywords: ["Imputation", "Mean/Median", "IQR method", "Z-score", "Domain context", "Drop nulls"],
    sampleIdealAnswer: "First, I inspect the percentage of nulls and check if missingness is completely random. For numerical data with outliers, I impute using median; for categorical, mode or a 'Unknown' bucket. For outliers, I use IQR boxplots and check business logic before capping or removing."
  },
  {
    id: "q-data-03",
    role: "data-analyst",
    category: "Technical",
    questionHinglish: "Business stakeholders ke liye executive dashboard design karte waqt top 3 design principles kya dhyan rakhoge?",
    questionEnglish: "What top 3 design principles do you follow when creating an executive dashboard in Power BI or Tableau?",
    expectedKeywords: ["KPI hierarchy", "Clutter-free", "Actionable insights", "Consistent palette", "Drill-down"],
    sampleIdealAnswer: "1. Prioritize high-level headline KPIs at the top left. 2. Keep visuals clean and decluttered with consistent color coding. 3. Enable interactive drill-downs so leaders can easily jump from macro view to root-cause details."
  },

  // 4. Python Developer Questions
  {
    id: "q-py-01",
    role: "python-developer",
    category: "Technical",
    questionHinglish: "Python mein list aur tuple mein kya difference hai, aur memory usage mein kaun better hota hai?",
    questionEnglish: "What is the difference between a list and a tuple in Python, and which is more memory efficient?",
    expectedKeywords: ["Mutable", "Immutable", "Memory allocation", "Over-allocation", "Hashable"],
    sampleIdealAnswer: "Lists are mutable and involve memory over-allocation for dynamic resizing. Tuples are immutable, have fixed memory footprint, allocate slightly faster, and can be used as dictionary keys because they are hashable."
  },
  {
    id: "q-py-02",
    role: "python-developer",
    category: "Technical",
    questionHinglish: "Python mein Decorators kya hote hain aur unka ek real-world use case batao.",
    questionEnglish: "What are decorators in Python and what is a practical real-world use case for them?",
    expectedKeywords: ["Higher-order function", "Wrapper", "Function modification", "Logging", "Authentication", "@syntax"],
    sampleIdealAnswer: "A decorator is a function that takes another function as an argument, extends its behavior without modifying source code, and returns the wrapped function. Common uses include route authentication checks and execution time logging."
  },
  {
    id: "q-py-03",
    role: "python-developer",
    category: "Technical",
    questionHinglish: "FastAPI aur Django mein tum kab kaunsa framework choose karoge?",
    questionEnglish: "When would you choose FastAPI over Django, and vice-versa?",
    expectedKeywords: ["Asynchronous", "Pydantic", "Admin panel", "ORM", "Batteries-included", "Microservice"],
    sampleIdealAnswer: "I choose FastAPI for lightweight, high-performance async microservices and automatic OpenAPI documentation. I choose Django when I need a monolithic 'batteries-included' system with built-in ORM, admin panel, and auth."
  },

  // 5. QA / Test Engineer Questions
  {
    id: "q-qa-01",
    role: "qa-test-engineer",
    category: "Technical",
    questionHinglish: "Bug report likhte waqt kaunse fields critical hote hain taaki developer use pehli baar mein reproduce kar sake?",
    questionEnglish: "What critical fields must a defect/bug report have so developers can immediately reproduce it?",
    expectedKeywords: ["Steps to reproduce", "Expected vs Actual", "Environment", "Severity/Priority", "Screenshots/Logs"],
    sampleIdealAnswer: "A high-quality bug report needs: concise Title, Environment (browser/OS/build version), exact Steps to Reproduce, Expected Result, Actual Result, Severity & Priority, and attached Console Logs or video evidence."
  },
  {
    id: "q-qa-02",
    role: "qa-test-engineer",
    category: "Technical",
    questionHinglish: "Selenium test automation mein Implicit Wait aur Explicit Wait mein kya antar hai?",
    questionEnglish: "What is the difference between Implicit Wait and Explicit Wait in Selenium WebDriver?",
    expectedKeywords: ["Global wait", "Condition-based", "ExpectedConditions", "Polling", "NoSuchElementException"],
    sampleIdealAnswer: "Implicit Wait applies globally across all element lookups throughout the driver session. Explicit Wait is applied on a specific element until an ExpectedCondition (like elementToBeClickable or visibilityOfElement) is met, avoiding unnecessary thread sleeps."
  },

  // 6. Java Developer Questions
  {
    id: "q-java-01",
    role: "java-developer",
    category: "Technical",
    questionHinglish: "Java mein HashMap internally kaise work karta hai (hashing, buckets, collision handling)?",
    questionEnglish: "How does HashMap work internally in Java, including hashing, buckets, and collision resolution?",
    expectedKeywords: ["hashCode()", "equals()", "Buckets", "LinkedList", "TreeNode / Red-Black Tree", "Load factor"],
    sampleIdealAnswer: "HashMap calculates the hash of the key and maps it to a bucket index. If multiple keys hash to the same bucket (collision), Java uses a linked list. In Java 8+, once the bucket exceeds 8 nodes, it transforms into a balanced Red-Black Tree for O(log n) lookup speed."
  },
  {
    id: "q-java-02",
    role: "java-developer",
    category: "Technical",
    questionHinglish: "Spring Boot mein Dependency Injection aur Inversion of Control (IoC) ka kya fayda hota hai?",
    questionEnglish: "What are the advantages of Dependency Injection and Inversion of Control in Spring Boot?",
    expectedKeywords: ["Decoupling", "Spring Container", "@Autowired", "Unit testing", "Mocking", "Loose coupling"],
    sampleIdealAnswer: "IoC transfers object creation responsibility to the Spring ApplicationContext container. Dependency Injection supplies dependencies from the outside, making code loosely coupled, easily configurable, and trivial to unit test using mocks."
  },

  // 7. Core Mechanical / Civil / Electrical Questions
  {
    id: "q-core-01",
    role: "core-mechanical",
    category: "Technical",
    questionHinglish: "Stress-Strain curve mein Yield Strength aur Ultimate Tensile Strength (UTS) ka physical meaning kya hai?",
    questionEnglish: "What is the physical meaning of Yield Strength and Ultimate Tensile Strength on a Stress-Strain curve?",
    expectedKeywords: ["Elastic limit", "Plastic deformation", "Permanent set", "Maximum load", "Necking"],
    sampleIdealAnswer: "Yield strength is the stress point beyond which the material undergoes permanent plastic deformation and will not return to its initial shape. UTS is the absolute maximum nominal engineering stress the material can endure before necking and fracture."
  },
  {
    id: "q-core-02",
    role: "core-civil",
    category: "Technical",
    questionHinglish: "Concrete slump test kyu kiya jata hai aur site par workability kaise measure karte hain?",
    questionEnglish: "Why is a concrete slump test performed and how does it determine workability on a construction site?",
    expectedKeywords: ["Workability", "Water-cement ratio", "Slump cone", "True slump", "Shear/Collapse"],
    sampleIdealAnswer: "The slump test checks the batch workability and consistency of fresh concrete before pouring. A standard cone is filled in layers, tamped, and lifted; the drop in height measures whether the water-cement ratio is optimal or too wet."
  },
  {
    id: "q-core-03",
    role: "core-electrical",
    category: "Technical",
    questionHinglish: "Transformer core mein Eddy current losses aur Hysteresis losses ko kaise reduce kiya jata hai?",
    questionEnglish: "How are eddy current losses and hysteresis losses minimized in an electrical transformer core?",
    expectedKeywords: ["Laminations", "Silicon steel", "Magnetic hysteresis loop", "Insulating varnish"],
    sampleIdealAnswer: "Eddy current losses are minimized by constructing the core from thin insulated laminations rather than a solid block. Hysteresis loss is reduced by using high-grade silicon steel with a narrow B-H hysteresis loop."
  },

  // 8. Sales / Digital Marketing Questions
  {
    id: "q-sales-01",
    role: "sales-bda",
    category: "Technical",
    questionHinglish: "Jab client bole 'Aapka product achha hai but budget bohot expensive hai', toh tum kaise handle karoge?",
    questionEnglish: "How do you handle the common objection: 'Your product is great, but it's way over our budget'?",
    expectedKeywords: ["Value proposition", "ROI", "Clarifying question", "Payment flexibility", "Cost of inaction"],
    sampleIdealAnswer: "I don't immediately discount. First, I validate their concern, ask which specific features are critical, and pivot to ROI: 'If this tool saves your team 15 hours a week, it pays for itself in 30 days.' If needed, I offer modular plans or staged rollout."
  },
  {
    id: "q-mkt-01",
    role: "digital-marketing",
    category: "Technical",
    questionHinglish: "High CPC wale search campaign mein Quality Score improve karne ke liye tum kya steps loge?",
    questionEnglish: "What steps would you take to improve Google Ads Quality Score to lower your Cost-Per-Click?",
    expectedKeywords: ["Ad relevance", "Landing page experience", "Expected CTR", "Negative keywords", "Search intent"],
    sampleIdealAnswer: "Quality Score depends on Expected CTR, Ad Relevance, and Landing Page Experience. I align ad copy tightly with exact keywords, optimize landing page mobile speed and headline match, and aggressively add negative keywords."
  },

  // 9. Project & Problem Solving
  {
    id: "q-proj-01",
    role: "all",
    category: "Project",
    questionHinglish: "Project develop karte waqt kisi unexpected bug ya architectural challenge ka example do jise tumne khud solve kiya.",
    questionEnglish: "Tell me about a difficult technical roadblock or bug you encountered during a project and how you resolved it.",
    expectedKeywords: ["Situation", "Task", "Action", "Result", "STAR method", "Debugging", "Root cause"],
    sampleIdealAnswer: "During a project demo, our database queries locked up under 50 concurrent requests. I analyzed the query execution plan, spotted missing indexes on frequently filtered foreign keys, added composite indexes, and reduced latency by 85%."
  },

  // 10. HR & Behavioral
  {
    id: "q-hr-01",
    role: "all",
    category: "HR/Behavioral",
    questionHinglish: "Agar team project mein kisi teammate ke saath opinion ya timeline conflict ho jaye, toh tum use kaise handle karte ho?",
    questionEnglish: "How do you navigate disagreements or deadline conflicts with teammates in a collaborative project?",
    expectedKeywords: ["Empathy", "Objective data", "Clear communication", "Compromise", "Focus on common goal"],
    sampleIdealAnswer: "I focus on the goal rather than personal egos. I schedule a quick 1-on-1 call, listen to their perspective first, look at objective constraints or requirements, and propose a data-backed compromise that protects the delivery timeline."
  },
  {
    id: "q-hr-02",
    role: "all",
    category: "HR/Behavioral",
    questionHinglish: "Agle 2-3 saal mein tumhara professional vision kya hai aur tum kis area mein subject-matter expert banna chahte ho?",
    questionEnglish: "Where do you see yourself in the next 2 to 3 years and what area do you aspire to master?",
    expectedKeywords: ["Skill mastery", "Ownership", "Mentorship", "Business impact", "Continuous learning"],
    sampleIdealAnswer: "In 2-3 years, I want to grow from a solid individual contributor to an engineer who owns end-to-end features, writes clean scalable code, and contributes actively to technical architecture discussions while helping freshers onboard."
  }
];

export function getInterviewQuestionsForRole(roleId: string): InterviewQuestion[] {
  // Always include intro, 2-3 tech questions for role, 1 project question, 1 HR question
  const intro = INTERVIEW_QUESTIONS.filter(q => q.category === "Introduction")[0];
  const tech = INTERVIEW_QUESTIONS.filter(q => q.role === roleId && q.category === "Technical");
  const fallbackTech = INTERVIEW_QUESTIONS.filter(q => q.category === "Technical").slice(0, 2);
  const selectedTech = tech.length >= 2 ? tech.slice(0, 3) : [...tech, ...fallbackTech].slice(0, 3);
  const project = INTERVIEW_QUESTIONS.filter(q => q.category === "Project")[0];
  const hr = INTERVIEW_QUESTIONS.filter(q => q.category === "HR/Behavioral")[0];

  return [intro, ...selectedTech, project, hr].filter(Boolean);
}
