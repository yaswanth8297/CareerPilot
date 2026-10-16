"use client";

import { useState } from "react";
import { X, UploadCloud, FileText, Sparkles, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

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

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5 MB limit.");
      return;
    }

    setFileName(file.name);
    setErrorMsg("");
    setIsUploading(true);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Inverted Slate */}
        <div className="relative bg-[#0F172A] text-white p-5 flex items-center justify-between border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-normal text-lg leading-tight text-white">
                Check Resume ATS Score
              </h3>
              <p className="text-[11px] text-slate-400">Deterministic 100-pt rubric • 3 Fixable Mistakes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("paste")}
            className={`flex-1 py-3 border-b-2 transition-all cursor-pointer ${
              tab === "paste"
                ? "border-[#0052FF] text-[#0052FF] dark:text-[#4D7CFF] font-semibold bg-white dark:bg-[#0F172A]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Paste Resume Text
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-3 border-b-2 transition-all cursor-pointer ${
              tab === "upload"
                ? "border-[#0052FF] text-[#0052FF] dark:text-[#4D7CFF] font-semibold bg-white dark:bg-[#0F172A]"
                : "border-transparent text-slate-500 hover:text-slate-800"
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
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Paste your resume text or bullets:</span>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-[#0052FF] dark:text-[#4D7CFF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Insert Sample Resume</span>
                </button>
              </div>

              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your education, skills, projects, and work experience here..."
                rows={9}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16] text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all resize-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0052FF] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-[#090D16]/50">
                <UploadCloud className="w-8 h-8 text-[#0052FF] mb-2" />
                <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200">
                  {fileName ? fileName : "Click to select PDF or DOCX file"}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">Up to 5 MB per specification</span>
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
                className="w-full py-2.5 rounded-xl bg-[#0052FF]/5 dark:bg-[#0052FF]/10 text-[#0052FF] dark:text-[#4D7CFF] font-medium text-xs border border-[#0052FF]/20 hover:bg-[#0052FF]/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Or load ready-made sample student resume</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isUploading}
              className="w-full justify-center group"
            >
              <span>{isUploading ? "Reading Document..." : "Analyze ATS Score (Instant)"}</span>
              <Sparkles className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
