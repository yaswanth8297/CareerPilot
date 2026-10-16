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
  AlertTriangle,
  ArrowRight,
  Clock,
  Target,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { getInitialState, saveState, logAnalytics } from "@/lib/storage/mockDb";
import { StudentProfile, ResumeAnalysisResult, RoadmapData, JobListing, InterviewReport } from "@/lib/types";
import ContactTrainingCard from "@/components/ContactTrainingCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

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
  const [consentModelTraining, setConsentModelTraining] = useState(false);

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

  const latestScore = resumeHistory[0]?.score ?? null;
  const latestInterview = interviewHistory[0]?.overallScore ?? null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Light SaaS Command Center Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-slate-50 text-slate-900 p-7 sm:p-10 shadow-saas border border-slate-200">
        <div className="absolute inset-0 dot-pattern-light opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <SectionLabel pulse={true}>
              STUDENT COMMAND CENTER • MY SPACE
            </SectionLabel>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              {profile ? `${profile.branch} Student Pilot` : "Welcome to Your "}{" "}
              <span className="saas-highlight">Career Space</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 font-sans">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                Target: <strong className="text-slate-900 font-medium">{profile?.targetRole || "Software Developer"}</strong>
              </span>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                Year: <strong className="text-slate-900 font-medium">{profile?.year || "3rd"}</strong>
              </span>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                Status: <strong className="text-blue-600 font-medium">{isRegistered ? "Verified Student" : "Guest Mode (Local)"}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/chat">
              <Button variant="primary" size="md" className="w-full justify-center group">
                <span>Open Co-Pilot Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm font-medium pb-px">
        {[
          { id: "overview", label: "Overview", icon: User },
          { id: "resume", label: "Resume Trend", icon: FileText, count: resumeHistory.length },
          { id: "roadmap", label: "90-Day Roadmap", icon: Compass, count: roadmap ? 12 : 0 },
          { id: "jobs", label: "Saved Jobs", icon: Bookmark, count: savedJobs.length },
          { id: "interviews", label: "Mock Interviews", icon: Award, count: interviewHistory.length },
          { id: "privacy", label: "Privacy & DPDP", icon: ShieldCheck }
        ].map(t => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {typeof t.count === "number" && t.count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {tab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Latest ATS Score */}
            <Card variant={latestScore && latestScore >= 75 ? "featured" : "elevated"} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">Latest ATS Score</span>
                <div className="w-8 h-8 rounded-lg bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-[#0F172A] dark:text-white">
                  {latestScore !== null ? latestScore : "—"}
                  <span className="text-sm font-sans font-normal text-slate-400 ml-1.5">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {resumeHistory.length > 0
                    ? `${resumeHistory.length} audit(s) recorded in your session.`
                    : "No resume audited yet."}
                </p>
              </div>
              <Link href="/chat?intent=resume_check" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-between group">
                  <span>{latestScore !== null ? "Re-Audit Resume" : "Audit Resume Free"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>

            {/* Card 2: 90-Day Roadmap Progress */}
            <Card variant="elevated" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">Roadmap Sequence</span>
                <div className="w-8 h-8 rounded-lg bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-[#0F172A] dark:text-white">
                  {roadmap ? "12 Weeks" : "Pending"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {roadmap ? "Grounded with vetted free resources." : "Generate your weekly structured milestone track."}
                </p>
              </div>
              <Link href="/chat?intent=roadmap" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-between group">
                  <span>{roadmap ? "Explore Weeks 1-12" : "Craft Custom Roadmap"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>

            {/* Card 3: Mock Interview Average */}
            <Card variant="elevated" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">Interview Rating</span>
                <div className="w-8 h-8 rounded-lg bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-[#0F172A] dark:text-white">
                  {latestInterview !== null ? latestInterview : "—"}
                  <span className="text-sm font-sans font-normal text-slate-400 ml-1.5">/ 10</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {interviewHistory.length > 0
                    ? `${interviewHistory.length} 5-minute session(s) completed.`
                    : "Practice with fresher-tuned questions."}
                </p>
              </div>
              <Link href="/chat?intent=mock_interview" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-between group">
                  <span>Start 5-Min Practice</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>
          </div>

          {/* Quick Action Launchers (Asymmetric minimal layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <Card className="p-7">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-normal text-xl text-[#0F172A] dark:text-white">Next Milestone Focus</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Recommended action to boost placement readiness</p>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] font-semibold uppercase tracking-wider">
                  Phase 1: Foundation
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0052FF] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">Rewrite resume bullets with quantifiable outcomes</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      Our deterministic audit spots weak action verbs and missing metrics. Replace generic statements with verified impact rewrites.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="text-slate-500">Estimated time: 10 mins</span>
                <Link href="/chat?intent=resume_check">
                  <Button variant="primary" size="sm">
                    Open Fixes in Chat →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Job Opportunities preview */}
            <Card className="p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-normal text-xl text-[#0F172A] dark:text-white">Curated Openings</h3>
                  <Briefcase className="w-4 h-4 text-[#0052FF]" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Verified scam-free fresher roles matched to your target role.
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#0F172A] dark:text-white block">Junior Frontend Developer</span>
                      <span className="text-slate-500">Remote / Bangalore • ₹4.5 - ₹7 LPA</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      92% Match
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link href="/chat?intent=jobs">
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Browse All Matching Jobs
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Resume History & Trend */}
      {tab === "resume" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-normal text-2xl text-[#0F172A] dark:text-white">Resume Score Audit History</h3>
              <p className="text-xs text-slate-500 mt-1">Track deterministic 100-point rubric audits across versions</p>
            </div>
            <Link href="/chat?intent=resume_check">
              <Button variant="primary" size="sm">
                New Resume Audit
              </Button>
            </Link>
          </div>

          {resumeHistory.length === 0 ? (
            <div className="text-center p-12 border rounded-2xl border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">No resumes analyzed yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Upload your PDF or paste resume text in Co-Pilot chat to see your 100-point rubric breakdown.
              </p>
              <Link href="/chat?intent=resume_check" className="mt-4 inline-block">
                <Button variant="primary" size="sm">
                  Run Free Audit in Chat →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumeHistory.map((res, i) => (
                <Card key={i} className="p-6 transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#0052FF] bg-[#0052FF]/10 px-2 py-0.5 rounded-full">
                          Audit #{resumeHistory.length - i}
                        </span>
                        <h4 className="font-semibold text-base text-[#0F172A] dark:text-white">{res.targetRole}</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        {res.verdict}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6">
                      <div className="text-right">
                        <span className="text-3xl font-mono font-bold text-[#0052FF]">{res.score}</span>
                        <span className="text-xs text-slate-400 font-sans block">/ 100 ATS</span>
                      </div>
                      <Link href="/chat?intent=resume_check">
                        <Button variant="outline" size="sm">
                          View Fixes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 90-Day Roadmap */}
      {tab === "roadmap" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-normal text-2xl text-[#0F172A] dark:text-white">90-Day Roadmap Track</h3>
              <p className="text-xs text-slate-500 mt-1">12-week structured milestones grounded in vetted free resources</p>
            </div>
            <Link href="/chat?intent=roadmap">
              <Button variant="primary" size="sm">
                Regenerate Roadmap
              </Button>
            </Link>
          </div>

          {roadmap && roadmap.weeks ? (
            <div className="space-y-4">
              {roadmap.weeks.map((wk, idx) => (
                <Card key={idx} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#0052FF] bg-[#0052FF]/10 px-2.5 py-0.5 rounded-full">
                        Week {wk.weekNumber}
                      </span>
                      <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">{wk.phase}</span>
                    </div>
                    <h4 className="text-base font-semibold text-[#0F172A] dark:text-white">{wk.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">{wk.description}</p>

                    {wk.resourceUrl && (
                      <div className="pt-2">
                        <a
                          href={wk.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#0052FF] dark:text-[#4D7CFF] bg-[#0052FF]/10 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <span>{wk.resourceTitle}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="font-mono text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium inline-block">
                      {idx < 2 ? "Free Preview" : "Registered"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-2xl border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
              <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">No Roadmap Generated Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Tell your Co-Pilot what role you are targeting to generate a week-by-week sequence.
              </p>
              <Link href="/chat?intent=roadmap" className="mt-4 inline-block">
                <Button variant="primary" size="sm">
                  Generate 90-Day Roadmap →
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Saved Jobs */}
      {tab === "jobs" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-normal text-2xl text-[#0F172A] dark:text-white">Verified Saved Jobs</h3>
              <p className="text-xs text-slate-500 mt-1">Scam-free opportunities ranked strictly on skill alignment</p>
            </div>
            <Link href="/chat?intent=jobs">
              <Button variant="primary" size="sm">
                Search More Matches
              </Button>
            </Link>
          </div>

          {savedJobs.length === 0 ? (
            <div className="text-center p-12 border rounded-2xl border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">No Saved Jobs</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Bookmark verified jobs in your chat session to review and apply anytime.
              </p>
              <Link href="/chat?intent=jobs" className="mt-4 inline-block">
                <Button variant="primary" size="sm">
                  Browse Fresher Matches →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Verified Recruiter
                        </span>
                        <span className="text-xs text-slate-400">{job.location}</span>
                      </div>
                      <h4 className="text-base font-semibold text-[#0F172A] dark:text-white">{job.title}</h4>
                      <p className="text-xs text-slate-500">{job.company} • {job.salaryRange}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.matchedSkills?.map((sk, sIdx) => (
                          <span key={sIdx} className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a href={job.applyUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm">
                          Apply Directly
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Mock Interviews */}
      {tab === "interviews" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-normal text-2xl text-[#0F172A] dark:text-white">Mock Interview Practice History</h3>
              <p className="text-xs text-slate-500 mt-1">Calibrated 5-minute sessions scored across 4 foundational pillars</p>
            </div>
            <Link href="/chat?intent=mock_interview">
              <Button variant="primary" size="sm">
                Start 5-Min Mock Interview
              </Button>
            </Link>
          </div>

          {interviewHistory.length === 0 ? (
            <div className="text-center p-12 border rounded-2xl border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
              <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">No Mock Interviews Recorded</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Practice 5 fresher-tuned technical and behavioral questions with timer and supportive model answers.
              </p>
              <Link href="/chat?intent=mock_interview" className="mt-4 inline-block">
                <Button variant="primary" size="sm">
                  Start Practice Session →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {interviewHistory.map((rep, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#0052FF] bg-[#0052FF]/10 px-2 py-0.5 rounded-full">
                          Session #{interviewHistory.length - idx}
                        </span>
                        <h4 className="font-semibold text-base text-[#0F172A] dark:text-white">5-Min Mock Interview</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                        Top strength: &quot;{rep.strengths?.[0] || "Clear communication"}&quot; • Key polish: &quot;{rep.improvements?.[0] || "Structured STAR responses"}&quot;
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Accuracy</span>
                          <span className="font-mono font-bold text-sm text-[#0052FF]">{rep.contentAccuracyScore}/10</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Clarity</span>
                          <span className="font-mono font-bold text-sm text-[#0052FF]">{rep.clarityScore}/10</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Confidence</span>
                          <span className="font-mono font-bold text-sm text-[#0052FF]">{rep.confidenceScore}/10</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Communication</span>
                          <span className="font-mono font-bold text-sm text-[#0052FF]">{rep.communicationScore}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6 shrink-0">
                      <span className="text-3xl font-mono font-bold text-[#0052FF]">{rep.overallScore}</span>
                      <span className="text-xs text-slate-400 font-sans block">/ 10 Rating</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Privacy & DPDP Act Controls */}
      {tab === "privacy" && (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
          <div>
            <h3 className="font-display font-normal text-2xl text-[#0F172A] dark:text-white">Privacy & Consent Controls</h3>
            <p className="text-xs text-slate-500 mt-1">
              Compliant with India&apos;s Digital Personal Data Protection (DPDP) Act. You maintain full ownership and control of your records.
            </p>
          </div>

          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">Essential Career Guidance Processing</h4>
                <p className="text-xs text-slate-500 mt-0.5">Required to calculate your ATS scores and generate 90-day roadmaps.</p>
              </div>
              <input
                type="checkbox"
                checked={consentDataProcessing}
                onChange={e => setConsentDataProcessing(e.target.checked)}
                className="w-4 h-4 rounded text-[#0052FF] focus:ring-[#0052FF]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">WhatsApp & Email Career Alerts</h4>
                <p className="text-xs text-slate-500 mt-0.5">Weekly milestone notifications and verified placement openings.</p>
              </div>
              <input
                type="checkbox"
                checked={consentWhatsAppUpdates}
                onChange={e => setConsentWhatsAppUpdates(e.target.checked)}
                className="w-4 h-4 rounded text-[#0052FF] focus:ring-[#0052FF]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">Model Training Opt-In (Off by default)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Permit anonymized resume patterns to improve placement models.</p>
              </div>
              <input
                type="checkbox"
                checked={consentModelTraining}
                onChange={e => setConsentModelTraining(e.target.checked)}
                className="w-4 h-4 rounded text-[#0052FF] focus:ring-[#0052FF]"
              />
            </div>
          </Card>

          {/* Export & Deletion */}
          <div className="space-y-4 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">Data Rights & Portability</h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleExportData}
                className="justify-center"
              >
                <Download className="w-4 h-4" />
                <span>Export Complete Data (JSON)</span>
              </Button>

              <button
                onClick={handleDeleteRequest}
                className="px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
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

      {/* 1-on-1 Mentorship Acceleration Banner */}
      <ContactTrainingCard className="mt-8" />
    </div>
  );
}
