"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  FileText,
  Compass,
  Bookmark,
  Award,
  ShieldCheck,
  Download,
  Trash2,
  TrendingUp,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { getInitialState, saveState, logAnalytics } from "@/lib/storage/mockDb";
import { StudentProfile, ResumeAnalysisResult, RoadmapData, JobListing, InterviewReport } from "@/lib/types";

export default function StudentDashboard() {
  const [tab, setTab] = useState<"overview" | "resume" | "roadmap" | "jobs" | "interviews" | "privacy">("overview");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [resumeHistory, setResumeHistory] = useState<ResumeAnalysisResult[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<InterviewReport[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<string | null>(null);

  // Consent states per India DPDP Act
  const [consentDataProcessing, setConsentDataProcessing] = useState(true);
  const [consentWhatsAppUpdates, setConsentWhatsAppUpdates] = useState(false);
  const [consentModelTraining, setConsentModelTraining] = useState(false); // Off by default per PRD

  useEffect(() => {
    const st = getInitialState();
    setIsRegistered(st.isRegistered);
    if (st.profile) setProfile(st.profile);
    if (st.resumeHistory) setResumeHistory(st.resumeHistory);
    if (st.roadmap) setRoadmap(st.roadmap);
    if (st.savedJobs) setSavedJobs(st.savedJobs);
    if (st.interviewHistory) setInterviewHistory(st.interviewHistory);
    logAnalytics("dashboard_viewed");
  }, []);

  // Export User Data as JSON (DPDP Compliance)
  const handleExportData = () => {
    const st = getInitialState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(st, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CareerPilot_Data_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Request Account Deletion
  const handleDeleteRequest = () => {
    if (confirm("Are you sure you want to request data deletion? Your guest data and history will be scheduled for permanent purge.")) {
      setDeletionStatus("Deletion request queued. Your session records will be purged within 30 days per retention policy.");
      logAnalytics("account_deletion_requested");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-orange-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Command Center • My Space</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile ? `${profile.branch} Student Pilot` : "Welcome to Your Career Space"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              Target: <strong className="text-white">{profile?.targetRole || "Software Developer"}</strong> • Year:{" "}
              {profile?.year || "3"} • Status: {isRegistered ? "Verified Student" : "Guest Mode (Local)"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Chat with Senior Bhaiya</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        {[
          { id: "overview", label: "Overview", icon: User },
          { id: "resume", label: "Resume Trend", icon: FileText },
          { id: "roadmap", label: "90-Day Roadmap", icon: Compass },
          { id: "jobs", label: "Saved Jobs", icon: Bookmark },
          { id: "interviews", label: "Mock Interviews", icon: Award },
          { id: "privacy", label: "Privacy & DPDP", icon: ShieldCheck }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                tab === t.id
                  ? "border-orange-500 text-orange-600 dark:text-orange-400 font-bold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Resume Score */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Latest ATS Score</span>
              <FileText className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">
              {resumeHistory[0]?.score || "—"}{" "}
              <span className="text-sm font-normal text-zinc-400">/ 100</span>
            </div>
            <p className="text-xs text-zinc-500">
              {resumeHistory.length > 0
                ? `${resumeHistory.length} audit(s) recorded in your session.`
                : "No resume audited yet."}
            </p>
            <Link href="/chat" className="text-xs font-semibold text-orange-600 hover:underline block pt-2">
              Run ATS Checker →
            </Link>
          </div>

          {/* Card 2: Roadmap Progress */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Roadmap Progress</span>
              <Compass className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">
              {roadmap ? "12 Weeks" : "Pending"}
            </div>
            <p className="text-xs text-zinc-500">Grounded with verified free guides.</p>
            <Link href="/chat" className="text-xs font-semibold text-indigo-600 hover:underline block pt-2">
              View Milestones →
            </Link>
          </div>

          {/* Card 3: Mock Interview Average */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mock Interview Rating</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">
              {interviewHistory[0]?.overallScore || "—"}{" "}
              <span className="text-sm font-normal text-zinc-400">/ 10</span>
            </div>
            <p className="text-xs text-zinc-500">
              {interviewHistory.length} 5-minute session(s) completed.
            </p>
            <Link href="/chat" className="text-xs font-semibold text-emerald-600 hover:underline block pt-2">
              Start Practice Session →
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Resume History & Trend */}
      {tab === "resume" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Resume Score Audit History</h3>
            <span className="text-xs text-zinc-500">{resumeHistory.length} audits</span>
          </div>

          {resumeHistory.length === 0 ? (
            <div className="text-center p-12 border rounded-2xl border-dashed border-zinc-300 dark:border-zinc-800">
              <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No resumes analyzed yet.</p>
              <Link href="/chat" className="text-xs font-bold text-orange-600 hover:underline mt-2 inline-block">
                Upload in Chat →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumeHistory.map((res, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-orange-600">Audit #{resumeHistory.length - i}</span>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{res.targetRole}</h4>
                    <p className="text-xs text-zinc-500">{res.verdict}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-orange-500">{res.score}/100</span>
                    <span className="text-[10px] text-zinc-400 block">ATS Score</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Privacy & DPDP Act Controls */}
      {tab === "privacy" && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Privacy & Consent Controls</h3>
            <p className="text-xs text-zinc-500 mt-1">
              In accordance with India&apos;s Digital Personal Data Protection (DPDP) Act. You have full ownership of your data.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Essential Career Guidance Processing</h4>
                <p className="text-[11px] text-zinc-500">Necessary to calculate ATS score and generate 90-day roadmap.</p>
              </div>
              <input
                type="checkbox"
                checked={consentDataProcessing}
                onChange={e => setConsentDataProcessing(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">WhatsApp & Email Career Alerts</h4>
                <p className="text-[11px] text-zinc-500">Weekly roadmap milestone reminders and new job openings.</p>
              </div>
              <input
                type="checkbox"
                checked={consentWhatsAppUpdates}
                onChange={e => setConsentWhatsAppUpdates(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Model Training Opt-In (Off by default)</h4>
                <p className="text-[11px] text-zinc-500">Allow anonymized resume patterns to improve Tier 2/3 career models.</p>
              </div>
              <input
                type="checkbox"
                checked={consentModelTraining}
                onChange={e => setConsentModelTraining(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
            </div>
          </div>

          {/* Export & Deletion */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Data Rights & Portability</h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export My Complete Data (JSON)</span>
              </button>

              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Request Account & Data Deletion</span>
              </button>
            </div>

            {deletionStatus && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{deletionStatus}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
