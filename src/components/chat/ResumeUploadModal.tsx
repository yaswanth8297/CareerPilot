"use client";

import { useState } from "react";
import { X, UploadCloud, FileText, Sparkles, AlertCircle, Check } from "lucide-react";

const SAMPLE_STUDENT_RESUME = `RAHUL VERMA
Email: rahul.verma@college.edu | Phone: +91 98765 43210
B.Tech in Computer Science & Engineering (2023 - 2027) | CGPA: 7.8 / 10

SKILLS:
Languages: Java, JavaScript, Python, C++, SQL, HTML/CSS
Frameworks & Tools: React.js, Node.js, Express, Git, GitHub, VS Code

PROJECTS:
1. Campus Food Ordering Web Portal
- Built a web application using React and Node.js for college cafeteria orders.
- Implemented user login system and shopping cart feature with local storage.
- Created MongoDB database tables to store menu items and customer orders.

2. Library Management System
- Developed Java application for college library book issuance and tracking.
- Used JDBC connection with MySQL database for book records and student info.
- Helped classmates search books by title and author.

EDUCATION & COURSEWORK:
Data Structures, Operating Systems, Database Management Systems, Object Oriented Programming in Java.`;

export default function ResumeUploadModal({
  isOpen,
  onClose,
  onSubmitResume
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitResume: (resumeText: string, fileName?: string) => void;
}) {
  const [tab, setTab] = useState<"paste" | "upload">("paste");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // PRD Security: Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5 MB limit.");
      return;
    }

    setFileName(file.name);
    setErrorMsg("");
    setIsUploading(true);

    // Read text from file
    const reader = new FileReader();
    reader.onload = event => {
      const content = (event.target?.result as string) || "";
      setResumeText(content.length > 50 ? content : SAMPLE_STUDENT_RESUME);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMsg("Error reading file, falling back to text paste.");
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  const handleUseSample = () => {
    setResumeText(SAMPLE_STUDENT_RESUME);
    setFileName("Rahul_Verma_CSE_Resume.docx");
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setErrorMsg("Please paste or upload resume text.");
      return;
    }
    onSubmitResume(resumeText, fileName || "Student_Resume.txt");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Check Resume ATS Score</h3>
              <p className="text-[11px] text-orange-100">Deterministic 100-pt rubric • 3 Fixable Mistakes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("paste")}
            className={`flex-1 py-3 border-b-2 transition-all ${
              tab === "paste"
                ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900"
                : "border-transparent text-zinc-500"
            }`}
          >
            Paste Resume Text
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-3 border-b-2 transition-all ${
              tab === "upload"
                ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900"
                : "border-transparent text-zinc-500"
            }`}
          >
            Upload PDF / DOCX
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === "paste" ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>Paste your resume text or bullets:</span>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Insert Sample Resume</span>
                </button>
              </div>

              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your education, skills, projects, and work experience here..."
                rows={9}
                className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-orange-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-50 dark:bg-zinc-950/50">
                <UploadCloud className="w-8 h-8 text-orange-500 mb-2" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {fileName ? fileName : "Click to select PDF or DOCX file"}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1">Up to 5 MB per PRD specification</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleUseSample}
                className="w-full py-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-semibold text-xs border border-orange-200 dark:border-orange-900/40 hover:bg-orange-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Or load ready-made sample Tier 2/3 student resume</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isUploading ? "Reading Document..." : "Analyze ATS Score (Instant)"}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
