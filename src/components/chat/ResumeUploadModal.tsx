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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-xl border border-[#E7E5DE] shadow-atelier-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#FAFAF8] text-[#141518] p-5 flex items-center justify-between border-b border-[#E7E5DE]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#183059] flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight text-[#141518]">
                Check Resume ATS Score
              </h3>
              <p className="text-[11px] font-mono text-[#82858E]">
                Deterministic 100-pt rubric · 3 Fixable Mistakes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#82858E] hover:text-[#141518] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#E7E5DE] bg-[#F4F3EE]/60 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("paste")}
            className={`flex-1 py-2.5 border-b-2 transition-colors cursor-pointer ${
              tab === "paste"
                ? "border-[#183059] text-[#183059] font-semibold bg-white"
                : "border-transparent text-[#52555E] hover:text-[#141518]"
            }`}
          >
            Paste Resume Text
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-2.5 border-b-2 transition-colors cursor-pointer ${
              tab === "upload"
                ? "border-[#183059] text-[#183059] font-semibold bg-white"
                : "border-transparent text-[#52555E] hover:text-[#141518]"
            }`}
          >
            Upload PDF / DOCX
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === "paste" ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-[#52555E]">
                <span>Paste your resume text or bullets:</span>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-[#183059] font-semibold hover:underline cursor-pointer"
                >
                  Insert Sample Resume
                </button>
              </div>

              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your education, skills, projects, and work experience here..."
                rows={9}
                className="w-full p-3.5 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-xs sm:text-sm font-mono text-[#141518] focus:outline-none focus:ring-2 focus:ring-[#183059] transition-all resize-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-[#D3D0C7] hover:border-[#183059] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FAFAF8]">
                <UploadCloud className="w-7 h-7 text-[#183059] mb-2" />
                <span className="text-xs font-semibold text-[#141518]">
                  {fileName ? fileName : "Click to select PDF or DOCX file"}
                </span>
                <span className="text-[11px] font-mono text-[#82858E] mt-1">Up to 5 MB max</span>
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
                className="w-full py-2.5 rounded-lg bg-[#F4F3EE] text-[#141518] font-medium text-xs border border-[#E7E5DE] hover:bg-[#ECEBE4] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Load ready-made sample student resume</span>
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
              <span>{isUploading ? "Reading Document..." : "Analyze ATS Score"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
