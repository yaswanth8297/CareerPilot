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
      <div className="rounded-xl bg-paper text-ink p-6 sm:p-8 shadow-atelier border border-hairline">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <SectionLabel>My Space · Career Command</SectionLabel>

            <h1 className="text-3xl sm:text-5xl font-poster uppercase tracking-wide text-ink leading-none pt-1">
              {profile ? `${profile.branch} Student ` : "Your "}
              <span className="text-brand-ink">Career Dossier</span>
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-ink-muted font-mono">
              <span className="flex items-center gap-1.5 bg-canvas px-3 py-1 rounded-md border border-hairline">
                <Target className="w-3.5 h-3.5 text-brand-ink" />
                <span>Target: <strong className="text-ink">{profile?.targetRole || "Software Developer"}</strong></span>
              </span>
              <span className="bg-canvas px-3 py-1 rounded-md border border-hairline">
                Year: <strong className="text-ink">{profile?.year || "3rd"}</strong>
              </span>
              <span className="bg-canvas px-3 py-1 rounded-md border border-hairline">
                Mode: <strong className={isRegistered ? "text-pass" : "text-brand-ink"}>{isRegistered ? "Verified" : "Guest (Local)"}</strong>
              </span>
            </div>
          </div>

          <div className="flex shrink-0">
            <Link href="/chat">
              <Button variant="cta" size="md" className="group">
                <span>Open Co-Pilot Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-hairline gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-medium">
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
                  ? "border-brand text-brand-ink font-semibold"
                  : "border-transparent text-ink-muted hover:text-ink hover:border-hairline-strong"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {typeof t.count === "number" && t.count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive
                    ? "bg-brand text-white"
                    : "bg-inset text-ink-muted border border-hairline"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant={latestScore && latestScore >= 75 ? "featured" : "elevated"} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle font-medium">
                  Latest ATS Score
                </span>
                <FileText className="w-4 h-4 text-brand-ink" />
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-ink tabular-nums">
                  {latestScore !== null ? latestScore : "—"}
                  <span className="text-sm font-sans font-normal text-ink-subtle ml-1.5">/ 100</span>
                </div>
                <p className="text-xs text-ink-muted mt-1">
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

            <Card variant="elevated" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle font-medium">
                  Roadmap Sequence
                </span>
                <Compass className="w-4 h-4 text-brand-ink" />
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-ink">
                  {roadmap ? "12 Wks" : "Pending"}
                </div>
                <p className="text-xs text-ink-muted mt-1">
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

            <Card variant="elevated" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle font-medium">
                  Interview Rating
                </span>
                <Award className="w-4 h-4 text-brand-ink" />
              </div>
              <div>
                <div className="text-4xl font-mono font-bold tracking-tight text-ink tabular-nums">
                  {latestInterview !== null ? latestInterview : "—"}
                  <span className="text-sm font-sans font-normal text-ink-subtle ml-1.5">/ 10</span>
                </div>
                <p className="text-xs text-ink-muted mt-1">
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

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl text-ink">Next Milestone Focus</h3>
                    <p className="text-xs text-ink-muted mt-0.5">Recommended action to raise placement readiness</p>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-inset border border-hairline text-brand-ink font-medium uppercase tracking-wider">
                    Phase 1: Foundation
                  </span>
                </div>

                <div className="p-4 rounded-lg border border-hairline bg-canvas space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-ink mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-ink">
                        Rewrite resume bullets with quantifiable outcomes
                      </h4>
                      <p className="text-xs text-ink-muted leading-relaxed mt-1">
                        Our deterministic audit identifies weak verbs and missing metrics, generating calibrated impact rewrites.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-hairline text-xs">
                <span className="font-mono text-ink-subtle">Est. time: 10 mins</span>
                <Link href="/chat?intent=resume_check">
                  <Button variant="primary" size="sm">
                    Open Fixes in Chat
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-xl text-ink">Curated Openings</h3>
                  <Briefcase className="w-4 h-4 text-brand-ink" />
                </div>
                <p className="text-xs text-ink-muted mb-4">
                  Verified scam-free fresher roles matched to your profile.
                </p>

                <div className="p-3 rounded-lg border border-hairline bg-canvas text-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-ink block">Junior Frontend Developer</span>
                    <span className="text-ink-muted font-mono text-[11px]">Remote / Bangalore · ₹4.5–7 LPA</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-pass bg-pass-bg border border-pass-border px-2 py-0.5 rounded shrink-0">
                    92% Match
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-hairline">
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
              <h3 className="font-display text-2xl text-ink">Resume Audit History</h3>
              <p className="text-xs text-ink-muted mt-1">Track deterministic 100-point rubric audits across versions</p>
            </div>
            <Link href="/chat?intent=resume_check">
              <Button variant="primary" size="sm">New Resume Audit</Button>
            </Link>
          </div>

          {resumeHistory.length === 0 ? (
            <div className="text-center p-12 border rounded-xl border-dashed border-hairline-strong bg-paper">
              <FileText className="w-8 h-8 text-ink-subtle mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-ink">No resumes audited yet</h4>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
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
                        <span className="font-mono text-[11px] font-semibold text-brand-ink bg-inset border border-hairline px-2 py-0.5 rounded">
                          Audit #{resumeHistory.length - i}
                        </span>
                        <h4 className="font-semibold text-base text-ink">{res.targetRole}</h4>
                      </div>
                      <p className="text-xs text-ink-muted max-w-2xl leading-relaxed">{res.verdict}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-hairline sm:pl-6">
                      <div className="text-right">
                        <span className="text-3xl font-mono font-bold text-brand-ink tabular-nums">{res.score}</span>
                        <span className="text-[11px] text-ink-subtle font-mono block">/ 100 ATS</span>
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
              <h3 className="font-display text-2xl text-ink">90-Day Roadmap Track</h3>
              <p className="text-xs text-ink-muted mt-1">12-week structured milestones grounded in vetted free resources</p>
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
                      <span className="font-mono text-xs font-semibold text-brand-ink bg-inset border border-hairline px-2.5 py-0.5 rounded">
                        Week {wk.weekNumber}
                      </span>
                      <span className="font-mono text-xs text-ink-subtle uppercase tracking-wider">{wk.phase}</span>
                    </div>
                    <h4 className="text-base font-semibold text-ink">{wk.title}</h4>
                    <p className="text-xs text-ink-muted max-w-xl leading-relaxed">{wk.description}</p>

                    {wk.resourceUrl && (
                      <div className="pt-1">
                        <a
                          href={wk.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-brand-ink hover:underline bg-canvas border border-hairline px-2.5 py-1 rounded"
                        >
                          <span>{wk.resourceTitle}</span>
                          <ExternalLink className="w-3 h-3 text-ink-subtle" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="font-mono text-[11px] text-pass bg-pass-bg border border-pass-border px-2.5 py-1 rounded font-medium inline-block">
                      {idx < 2 ? "Free Preview" : "Registered"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-xl border-dashed border-hairline-strong bg-paper">
              <Compass className="w-8 h-8 text-ink-subtle mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-ink">No Roadmap Generated Yet</h4>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
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
              <h3 className="font-display text-2xl text-ink">Verified Saved Jobs</h3>
              <p className="text-xs text-ink-muted mt-1">Scam-free opportunities ranked strictly on skill alignment</p>
            </div>
            <Link href="/chat?intent=jobs">
              <Button variant="primary" size="sm">Search More Matches</Button>
            </Link>
          </div>

          {savedJobs.length === 0 ? (
            <div className="text-center p-12 border rounded-xl border-dashed border-hairline-strong bg-paper">
              <Bookmark className="w-8 h-8 text-ink-subtle mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-ink">No Saved Jobs</h4>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
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
                        <span className="font-mono text-[10px] font-semibold text-pass bg-pass-bg border border-pass-border px-2 py-0.5 rounded">
                          Verified Recruiter
                        </span>
                        <span className="text-xs text-ink-subtle">{job.location}</span>
                      </div>
                      <h4 className="text-base font-semibold text-ink">{job.title}</h4>
                      <p className="text-xs text-ink-muted">{job.company} · {job.salaryRange}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.matchedSkills?.map((sk, sIdx) => (
                          <span key={sIdx} className="font-mono text-[10px] bg-canvas border border-hairline text-ink-muted px-2 py-0.5 rounded">
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
              <h3 className="font-display text-2xl text-ink">Mock Interview Practice History</h3>
              <p className="text-xs text-ink-muted mt-1">Calibrated 5-minute sessions scored across 4 foundational pillars</p>
            </div>
            <Link href="/chat?intent=mock_interview">
              <Button variant="primary" size="sm">Start 5-Min Mock Interview</Button>
            </Link>
          </div>

          {interviewHistory.length === 0 ? (
            <div className="text-center p-12 border rounded-xl border-dashed border-hairline-strong bg-paper">
              <Award className="w-8 h-8 text-ink-subtle mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-ink">No Mock Interviews Recorded</h4>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
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
                        <span className="font-mono text-xs font-semibold text-brand-ink bg-inset border border-hairline px-2 py-0.5 rounded">
                          Session #{interviewHistory.length - idx}
                        </span>
                        <h4 className="font-semibold text-base text-ink">5-Min Mock Interview</h4>
                      </div>
                      <p className="text-xs text-ink-muted max-w-xl leading-relaxed">
                        Top strength: &quot;{rep.strengths?.[0] || "Clear communication"}&quot; · Key polish: &quot;{rep.improvements?.[0] || "Structured STAR responses"}&quot;
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {[
                          { label: "Accuracy", val: rep.contentAccuracyScore },
                          { label: "Clarity", val: rep.clarityScore },
                          { label: "Confidence", val: rep.confidenceScore },
                          { label: "Communication", val: rep.communicationScore }
                        ].map(item => (
                          <div key={item.label} className="p-2 rounded-lg bg-canvas border border-hairline text-center">
                            <span className="text-[10px] text-ink-subtle uppercase font-mono block">{item.label}</span>
                            <span className="font-mono font-bold text-sm text-brand-ink tabular-nums">{item.val}/10</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-hairline sm:pl-6 shrink-0">
                      <span className="text-3xl font-mono font-bold text-brand-ink tabular-nums">{rep.overallScore}</span>
                      <span className="text-xs text-ink-subtle font-mono block">/ 10 Rating</span>
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
            <h3 className="font-display text-2xl text-ink">Privacy &amp; Consent Controls</h3>
            <p className="text-xs text-ink-muted mt-1">
              Compliant with India&apos;s Digital Personal Data Protection (DPDP) Act. You maintain full ownership of your records.
            </p>
          </div>

          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-ink">Essential Career Guidance Processing</h4>
                <p className="text-xs text-ink-muted mt-0.5">Required to compute ATS scores and generate 90-day roadmaps.</p>
              </div>
              <input
                type="checkbox"
                checked={consentDataProcessing}
                onChange={e => setConsentDataProcessing(e.target.checked)}
                className="w-4 h-4 accent-brand"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-hairline">
              <div>
                <h4 className="text-sm font-semibold text-ink">WhatsApp &amp; Email Career Alerts</h4>
                <p className="text-xs text-ink-muted mt-0.5">Weekly milestone notifications and verified placement openings.</p>
              </div>
              <input
                type="checkbox"
                checked={consentWhatsAppUpdates}
                onChange={e => setConsentWhatsAppUpdates(e.target.checked)}
                className="w-4 h-4 accent-brand"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-hairline">
              <div>
                <h4 className="text-sm font-semibold text-ink">Model Training Opt-In (Off by default)</h4>
                <p className="text-xs text-ink-muted mt-0.5">Permit anonymized resume patterns to improve placement models.</p>
              </div>
              <input
                type="checkbox"
                checked={consentModelTraining}
                onChange={e => setConsentModelTraining(e.target.checked)}
                className="w-4 h-4 accent-brand"
              />
            </div>
          </Card>

          <div className="space-y-4 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink-subtle font-medium">
              Data Rights &amp; Portability
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="md" onClick={handleExportData}>
                <Download className="w-4 h-4" />
                <span>Export Complete Data (JSON)</span>
              </Button>

              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2 rounded-full border border-fix-border bg-fix-bg hover:opacity-90 text-xs font-medium text-fix flex items-center justify-center gap-2 transition-opacity cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Request Account &amp; Data Deletion</span>
              </button>
            </div>

            {deletionStatus && (
              <p className="text-xs text-warn font-medium">{deletionStatus}</p>
            )}
          </div>
        </div>
      )}

      {/* 1-on-1 Mentorship Acceleration Banner */}
      <ContactTrainingCard className="mt-8" />
    </div>
  );
}
