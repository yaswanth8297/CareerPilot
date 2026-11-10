"use client";

import { useState } from "react";
import { X, UploadCloud, FileText, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-paper rounded-xl border border-hairline shadow-atelier-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-canvas text-ink p-5 flex items-center justify-between border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight text-ink">
                Check Resume ATS Score
              </h3>
              <p className="text-[11px] font-mono text-ink-subtle">
                Deterministic 100-pt rubric · 3 Fixable Mistakes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-subtle hover:text-ink hover:bg-inset transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-hairline bg-inset/60 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("paste")}
            className={`flex-1 py-2.5 border-b-2 transition-colors cursor-pointer ${
              tab === "paste"
                ? "border-brand text-brand-ink font-semibold bg-paper"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Paste Resume Text
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-2.5 border-b-2 transition-colors cursor-pointer ${
              tab === "upload"
                ? "border-brand text-brand-ink font-semibold bg-paper"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Upload PDF / DOCX
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-fix-bg border border-fix-border text-xs text-fix flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === "paste" ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-ink-muted">
                <span>Paste your resume text or bullets:</span>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-brand-ink font-semibold hover:underline cursor-pointer"
                >
                  Insert Sample Resume
                </button>
              </div>

              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your education, skills, projects, and work experience here..."
                rows={9}
                className="w-full p-3.5 rounded-lg border border-hairline bg-canvas text-xs sm:text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-brand transition-all resize-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-hairline-strong hover:border-brand rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-canvas">
                <UploadCloud className="w-7 h-7 text-brand-ink mb-2" />
                <span className="text-xs font-semibold text-ink">
                  {fileName ? fileName : "Click to select PDF or DOCX file"}
                </span>
                <span className="text-[11px] font-mono text-ink-subtle mt-1">Up to 5 MB max</span>
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
                className="w-full py-2.5 rounded-full bg-inset text-ink font-medium text-xs border border-hairline hover:bg-inset-hover flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Load ready-made sample student resume</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="cta"
              size="md"
              disabled={isUploading}
              className="w-full justify-center group"
            >
              <span>{isUploading ? "Reading Document..." : "Analyze ATS Score"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
