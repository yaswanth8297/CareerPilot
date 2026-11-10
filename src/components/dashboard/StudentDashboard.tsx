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
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Target,
  Briefcase
} from "lucide-react";
import { getInitialState, logAnalytics } from "@/lib/storage/mockDb";
import { StudentProfile, ResumeAnalysisResult, RoadmapData, JobListing, InterviewReport } from "@/lib/types";
import ContactTrainingCard from "@/components/ContactTrainingCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

  const handleDeleteRequest = () => {
    if (confirm("Are you sure you want to request data deletion? Your guest data and history will be scheduled for permanent purge.")) {
      setDeletionStatus("Deletion request queued. Your session records will be purged within 30 days per retention policy.");
      logAnalytics("account_deletion_requested");
    }
  };

  const latestScore = resumeHistory[0]?.score ?? null;
  const latestInterview = interviewHistory[0]?.overallScore ?? null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="rounded-xl bg-white text-[#141518] p-6 sm:p-8 shadow-atelier border border-[#E7E5DE]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <SectionLabel>My Space · Career Command</SectionLabel>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#141518] leading-tight">
              {profile ? `${profile.branch} Student ` : "Your "}
              <span className="font-display italic font-normal text-[#183059]">Career Dossier</span>
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#52555E] font-mono">
              <span className="flex items-center gap-1.5 bg-[#FAFAF8] px-3 py-1 rounded-md border border-[#E7E5DE]">
                <Target className="w-3.5 h-3.5 text-[#183059]" />
                <span>Target: <strong className="text-[#141518]">{profile?.targetRole || "Software Developer"}</strong></span>
              </span>
              <span className="bg-[#FAFAF8] px-3 py-1 rounded-md border border-[#E7E5DE]">
                Year: <strong className="text-[#141518]">{profile?.year || "3rd"}</strong>
              </span>
              <span className="bg-[#FAFAF8] px-3 py-1 rounded-md border border-[#E7E5DE]">
                Mode: <strong className={isRegistered ? "text-[#166534]" : "text-[#183059]"}>{isRegistered ? "Verified" : "Guest (Local)"}</strong>
              </span>
            </div>
          </div>

          <div className="flex shrink-0">
            <Link href="/chat">
              <Button variant="primary" size="md" className="group">
                <span>Open Co-Pilot Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#E7E5DE] gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-medium">
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
              className={`py-3 px-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "border-[#183059] text-[#183059] font-semibold"
                  : "border-transparent text-[#52555E] hover:text-[#141518] hover:border-[#D3D0C7]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {typeof t.count === "number" && t.count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive
                    ? "bg-[#183059] text-white"
                    : "bg-[#F4F3EE] text-[#52555E] border border-[#E7E5DE]"
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
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Latest ATS Score */}
            <Card variant={latestScore && latestScore >= 75 ? "featured" : "elevated"} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#82858E] font-medium">
                  Latest ATS Score
                </span>
                <FileText className="w-4 h-4 text-[#183059]" />
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-[#141518] tabular-nums">
                  {latestScore !== null ? latestScore : "—"}
                  <span className="text-sm font-sans font-normal text-[#82858E] ml-1.5">/ 100</span>
                </div>
                <p className="text-xs text-[#52555E] mt-1">
                  {resumeHistory.length > 0
                    ? `${resumeHistory.length} audit(s) recorded in this session.`
                    : "No resume audited yet."}
                </p>
              </div>
              <Link href="/chat?intent=resume_check" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-between group">
                  <span>{latestScore !== null ? "Re-Audit Resume" : "Audit Resume Free"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </Card>

            {/* 90-Day Roadmap Progress */}
            <Card variant="elevated" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#82858E] font-medium">
                  Roadmap Sequence
                </span>
                <Compass className="w-4 h-4 text-[#183059]" />
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-[#141518]">
                  {roadmap ? "12 Wks" : "Pending"}
                </div>
                <p className="text-xs text-[#52555E] mt-1">
                  {roadmap ? "Grounded with vetted free tutorials." : "Generate your weekly milestone track."}
                </p>
              </div>
              <Link href="/chat?intent=roadmap" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-between group">
                  <span>{roadmap ? "Explore Weeks 1–12" : "Build Custom Roadmap"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </Card>

            {/* Mock Interview Rating */}
            <Card variant="elevated" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#82858E] font-medium">
                  Interview Rating
                </span>
                <Award className="w-4 h-4 text-[#183059]" />
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-[#141518] tabular-nums">
                  {latestInterview !== null ? latestInterview : "—"}
                  <span className="text-sm font-sans font-normal text-[#82858E] ml-1.5">/ 10</span>
                </div>
                <p className="text-xs text-[#52555E] mt-1">
                  {interviewHistory.length > 0
                    ? `${interviewHistory.length} 5-minute drill(s) completed.`
                    : "Practice fresher-tuned technical rounds."}
                </p>
              </div>
              <Link href="/chat?intent=mock_interview" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-between group">
                  <span>Start 5-Min Practice</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </Card>
          </div>

          {/* Asymmetric Action Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl text-[#141518]">Next Milestone Focus</h3>
                    <p className="text-xs text-[#52555E] mt-0.5">Recommended action to raise placement readiness</p>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#F4F3EE] border border-[#E7E5DE] text-[#183059] font-medium uppercase tracking-wider">
                    Phase 1: Foundation
                  </span>
                </div>

                <div className="p-4 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#183059] mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#141518]">
                        Rewrite resume bullets with quantifiable outcomes
                      </h4>
                      <p className="text-xs text-[#52555E] leading-relaxed mt-1">
                        Our deterministic audit identifies weak verbs and missing metrics, generating calibrated impact rewrites.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#E7E5DE] text-xs">
                <span className="font-mono text-[#82858E]">Est. time: 10 mins</span>
                <Link href="/chat?intent=resume_check">
                  <Button variant="primary" size="sm">
                    Open Fixes in Chat
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Curated Openings preview */}
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-xl text-[#141518]">Curated Openings</h3>
                  <Briefcase className="w-4 h-4 text-[#183059]" />
                </div>
                <p className="text-xs text-[#52555E] mb-4">
                  Verified scam-free fresher roles matched to your profile.
                </p>

                <div className="p-3 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-[#141518] block">Junior Frontend Developer</span>
                    <span className="text-[#52555E] font-mono text-[11px]">Remote / Bangalore · ₹4.5–7 LPA</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded shrink-0">
                    92% Match
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E7E5DE]">
                <Link href="/chat?intent=jobs">
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Browse Matching Jobs
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Resume History */}
      {tab === "resume" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-[#141518]">Resume Audit History</h3>
              <p className="text-xs text-[#52555E] mt-1">Track deterministic 100-point rubric audits across versions</p>
            </div>
            <Link href="/chat?intent=resume_check">
              <Button variant="primary" size="sm">New Resume Audit</Button>
            </Link>
          </div>

          {resumeHistory.length === 0 ? (
            <div className="text-center p-12 border rounded-xl border-dashed border-[#D3D0C7] bg-white">
              <FileText className="w-8 h-8 text-[#82858E] mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#141518]">No resumes audited yet</h4>
              <p className="text-xs text-[#52555E] max-w-sm mx-auto mt-1">
                Upload your PDF or paste resume text in Co-Pilot chat to view your 100-point breakdown.
              </p>
              <Link href="/chat?intent=resume_check" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Run Free Audit</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumeHistory.map((res, i) => (
                <Card key={i} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#183059] bg-[#F4F3EE] border border-[#E7E5DE] px-2 py-0.5 rounded">
                          Audit #{resumeHistory.length - i}
                        </span>
                        <h4 className="font-semibold text-base text-[#141518]">{res.targetRole}</h4>
                      </div>
                      <p className="text-xs text-[#52555E] max-w-2xl leading-relaxed">{res.verdict}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-[#E7E5DE] sm:pl-6">
                      <div className="text-right">
                        <span className="text-3xl font-mono font-bold text-[#183059] tabular-nums">{res.score}</span>
                        <span className="text-[11px] text-[#82858E] font-mono block">/ 100 ATS</span>
                      </div>
                      <Link href="/chat?intent=resume_check">
                        <Button variant="outline" size="sm">View Fixes</Button>
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
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-[#141518]">90-Day Roadmap Track</h3>
              <p className="text-xs text-[#52555E] mt-1">12-week structured milestones grounded in vetted free resources</p>
            </div>
            <Link href="/chat?intent=roadmap">
              <Button variant="primary" size="sm">Regenerate Roadmap</Button>
            </Link>
          </div>

          {roadmap && roadmap.weeks ? (
            <div className="space-y-4">
              {roadmap.weeks.map((wk, idx) => (
                <Card key={idx} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#183059] bg-[#F4F3EE] border border-[#E7E5DE] px-2.5 py-0.5 rounded">
                        Week {wk.weekNumber}
                      </span>
                      <span className="font-mono text-xs text-[#82858E] uppercase tracking-wider">{wk.phase}</span>
                    </div>
                    <h4 className="text-base font-semibold text-[#141518]">{wk.title}</h4>
                    <p className="text-xs text-[#52555E] max-w-xl leading-relaxed">{wk.description}</p>

                    {wk.resourceUrl && (
                      <div className="pt-1">
                        <a
                          href={wk.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#183059] hover:underline bg-[#FAFAF8] border border-[#E7E5DE] px-2.5 py-1 rounded"
                        >
                          <span>{wk.resourceTitle}</span>
                          <ExternalLink className="w-3 h-3 text-[#82858E]" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="font-mono text-[11px] text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded font-medium inline-block">
                      {idx < 2 ? "Free Preview" : "Registered"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-xl border-dashed border-[#D3D0C7] bg-white">
              <Compass className="w-8 h-8 text-[#82858E] mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#141518]">No Roadmap Generated Yet</h4>
              <p className="text-xs text-[#52555E] max-w-sm mx-auto mt-1">
                Tell your Co-Pilot your target role to build a 12-week sequence.
              </p>
              <Link href="/chat?intent=roadmap" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Generate 90-Day Roadmap</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Saved Jobs */}
      {tab === "jobs" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-[#141518]">Verified Saved Jobs</h3>
              <p className="text-xs text-[#52555E] mt-1">Scam-free opportunities ranked strictly on skill alignment</p>
            </div>
            <Link href="/chat?intent=jobs">
              <Button variant="primary" size="sm">Search More Matches</Button>
            </Link>
          </div>

          {savedJobs.length === 0 ? (
            <div className="text-center p-12 border rounded-xl border-dashed border-[#D3D0C7] bg-white">
              <Bookmark className="w-8 h-8 text-[#82858E] mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#141518]">No Saved Jobs</h4>
              <p className="text-xs text-[#52555E] max-w-sm mx-auto mt-1">
                Bookmark verified jobs in your chat session to review and apply anytime.
              </p>
              <Link href="/chat?intent=jobs" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Browse Fresher Matches</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded">
                          Verified Recruiter
                        </span>
                        <span className="text-xs text-[#82858E]">{job.location}</span>
                      </div>
                      <h4 className="text-base font-semibold text-[#141518]">{job.title}</h4>
                      <p className="text-xs text-[#52555E]">{job.company} · {job.salaryRange}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.matchedSkills?.map((sk, sIdx) => (
                          <span key={sIdx} className="font-mono text-[10px] bg-[#FAFAF8] border border-[#E7E5DE] text-[#52555E] px-2 py-0.5 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a href={job.applyUrl || "#"} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="sm">Apply Directly</Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Mock Interviews */}
      {tab === "interviews" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-[#141518]">Mock Interview Practice History</h3>
              <p className="text-xs text-[#52555E] mt-1">Calibrated 5-minute sessions scored across 4 foundational pillars</p>
            </div>
            <Link href="/chat?intent=mock_interview">
              <Button variant="primary" size="sm">Start 5-Min Mock Interview</Button>
            </Link>
          </div>

          {interviewHistory.length === 0 ? (
            <div className="text-center p-12 border rounded-xl border-dashed border-[#D3D0C7] bg-white">
              <Award className="w-8 h-8 text-[#82858E] mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#141518]">No Mock Interviews Recorded</h4>
              <p className="text-xs text-[#52555E] max-w-sm mx-auto mt-1">
                Practice 5 fresher-tuned technical and behavioral questions with model answers.
              </p>
              <Link href="/chat?intent=mock_interview" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Start Practice Session</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {interviewHistory.map((rep, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#183059] bg-[#F4F3EE] border border-[#E7E5DE] px-2 py-0.5 rounded">
                          Session #{interviewHistory.length - idx}
                        </span>
                        <h4 className="font-semibold text-base text-[#141518]">5-Min Mock Interview</h4>
                      </div>
                      <p className="text-xs text-[#52555E] max-w-xl leading-relaxed">
                        Top strength: &quot;{rep.strengths?.[0] || "Clear communication"}&quot; · Key polish: &quot;{rep.improvements?.[0] || "Structured STAR responses"}&quot;
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {[
                          { label: "Accuracy", val: rep.contentAccuracyScore },
                          { label: "Clarity", val: rep.clarityScore },
                          { label: "Confidence", val: rep.confidenceScore },
                          { label: "Communication", val: rep.communicationScore }
                        ].map(item => (
                          <div key={item.label} className="p-2 rounded-lg bg-[#FAFAF8] border border-[#E7E5DE] text-center">
                            <span className="text-[10px] text-[#82858E] uppercase font-mono block">{item.label}</span>
                            <span className="font-mono font-bold text-sm text-[#183059] tabular-nums">{item.val}/10</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-[#E7E5DE] sm:pl-6 shrink-0">
                      <span className="text-3xl font-mono font-bold text-[#183059] tabular-nums">{rep.overallScore}</span>
                      <span className="text-xs text-[#82858E] font-mono block">/ 10 Rating</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Privacy & DPDP */}
      {tab === "privacy" && (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
          <div>
            <h3 className="font-display text-2xl text-[#141518]">Privacy &amp; Consent Controls</h3>
            <p className="text-xs text-[#52555E] mt-1">
              Compliant with India&apos;s Digital Personal Data Protection (DPDP) Act. You maintain full ownership of your records.
            </p>
          </div>

          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[#141518]">Essential Career Guidance Processing</h4>
                <p className="text-xs text-[#52555E] mt-0.5">Required to compute ATS scores and generate 90-day roadmaps.</p>
              </div>
              <input
                type="checkbox"
                checked={consentDataProcessing}
                onChange={e => setConsentDataProcessing(e.target.checked)}
                className="w-4 h-4 accent-[#183059]"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#E7E5DE]">
              <div>
                <h4 className="text-sm font-semibold text-[#141518]">WhatsApp &amp; Email Career Alerts</h4>
                <p className="text-xs text-[#52555E] mt-0.5">Weekly milestone notifications and verified placement openings.</p>
              </div>
              <input
                type="checkbox"
                checked={consentWhatsAppUpdates}
                onChange={e => setConsentWhatsAppUpdates(e.target.checked)}
                className="w-4 h-4 accent-[#183059]"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#E7E5DE]">
              <div>
                <h4 className="text-sm font-semibold text-[#141518]">Model Training Opt-In (Off by default)</h4>
                <p className="text-xs text-[#52555E] mt-0.5">Permit anonymized resume patterns to improve placement models.</p>
              </div>
              <input
                type="checkbox"
                checked={consentModelTraining}
                onChange={e => setConsentModelTraining(e.target.checked)}
                className="w-4 h-4 accent-[#183059]"
              />
            </div>
          </Card>

          <div className="space-y-4 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#82858E] font-medium">
              Data Rights &amp; Portability
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="md" onClick={handleExportData}>
                <Download className="w-4 h-4" />
                <span>Export Complete Data (JSON)</span>
              </Button>

              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-xs font-medium text-[#991B1B] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Request Account &amp; Data Deletion</span>
              </button>
            </div>

            {deletionStatus && (
              <p className="text-xs text-[#92400E] font-medium">{deletionStatus}</p>
            )}
          </div>
        </div>
      )}

      {/* 1-on-1 Mentorship Acceleration Banner */}
      <ContactTrainingCard className="mt-8" />
    </div>
  );
}
