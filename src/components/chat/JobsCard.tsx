"use client";

import { useState } from "react";
import { Briefcase, AlertOctagon, ExternalLink, Bookmark, BookmarkCheck, ShieldAlert, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { JobListing } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function JobsCard({
  jobs,
  isGuest = true,
  onSaveJob,
  onReportJob,
  onUnlockAllJobs
}: {
  jobs: JobListing[];
  isGuest?: boolean;
  onSaveJob?: (job: JobListing) => void;
  onReportJob?: (jobId: string) => void;
  onUnlockAllJobs?: () => void;
}) {
  const [filterType, setFilterType] = useState<"all" | "Fresher" | "Internship">("all");
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [reportedJobIds, setReportedJobIds] = useState<string[]>([]);

  const handleToggleSave = (job: JobListing) => {
    if (savedJobIds.includes(job.id)) {
      setSavedJobIds(savedJobIds.filter(id => id !== job.id));
    } else {
      setSavedJobIds([...savedJobIds, job.id]);
    }
    if (onSaveJob) onSaveJob(job);
  };

  const handleReport = (jobId: string) => {
    setReportedJobIds([...reportedJobIds, jobId]);
    if (onReportJob) onReportJob(jobId);
  };

  const visibleJobs = isGuest ? jobs.slice(0, 3) : jobs;
  const filteredJobs =
    filterType === "all" ? visibleJobs : visibleJobs.filter(j => j.jobType.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xl overflow-hidden transition-all my-3">
      {/* Inverted Slate Header */}
      <div className="relative bg-[#0F172A] text-white p-5 sm:p-6 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#0052FF]/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <SectionLabel pulse={true} className="border-white/20 bg-white/10 text-white mb-2.5">
              SKILL-MATCHED ROLES
            </SectionLabel>
            <h3 className="text-xl font-display font-normal tracking-tight text-white">
              Curated <span className="gradient-text">Fresher Openings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Unbiased matching • Scams auto-flagged • Zero college-tier prejudice
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-[#4D7CFF] font-semibold border border-white/10 shrink-0">
            {jobs.length} Matches
          </span>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] overflow-x-auto text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            filterType === "all"
              ? "bg-[#0052FF] text-white font-semibold"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType("Fresher")}
          className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            filterType === "Fresher"
              ? "bg-[#0052FF] text-white font-semibold"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          }`}
        >
          Fresher Roles
        </button>
        <button
          onClick={() => setFilterType("Internship")}
          className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            filterType === "Internship"
              ? "bg-[#0052FF] text-white font-semibold"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          }`}
        >
          Internships
        </button>
      </div>

      {/* Jobs Feed */}
      <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
        {filteredJobs.map(job => {
          const isSaved = savedJobIds.includes(job.id);
          const isReported = reportedJobIds.includes(job.id);

          if (job.isScamSuspicious) {
            return (
              <div
                key={job.id}
                className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-4 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 font-semibold text-xs">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    ⚠️ WARNING: Suspicious Posting Flagged
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{job.postedDate}</span>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-through opacity-80">
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-500">{job.company}</p>
                </div>

                <div className="bg-rose-100/70 dark:bg-rose-900/30 p-2.5 rounded-lg text-xs text-rose-800 dark:text-rose-300 space-y-1">
                  <p className="font-semibold text-[11px]">CareerPilot Advisory (Heuristics detected):</p>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    {job.scamReasons?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <button
                    onClick={() => handleReport(job.id)}
                    disabled={isReported}
                    className="text-rose-600 dark:text-rose-400 font-semibold hover:underline text-[11px] cursor-pointer"
                  >
                    {isReported ? "✓ Reported for moderation" : "Report this scam"}
                  </button>
                  <span className="text-[10px] text-slate-400 italic">Do not pay money for jobs!</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3 hover:border-[#0052FF]/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm text-[#0F172A] dark:text-white">{job.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {job.company} • {job.location} {job.isRemote && "• Remote"}
                  </p>
                </div>

                {/* Match percentage pill */}
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0052FF]/10 text-[#0052FF] dark:text-[#4D7CFF] text-xs font-mono font-semibold shrink-0">
                  <Sparkles className="w-3 h-3" />
                  <span>{job.matchPercent}% Match</span>
                </div>
              </div>

              {job.hasCgpaFilter && (
                <div className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[11px] font-medium flex items-center gap-1.5 border border-amber-200 dark:border-amber-800">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  <span>Note: Explicit criteria mentioned ({job.minCgpaRequired}+ CGPA requested).</span>
                </div>
              )}

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                <strong className="text-[#0052FF] dark:text-[#4D7CFF] font-semibold">Match rationale:</strong> {job.whyItMatches}
              </p>

              {job.missingSkills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="text-slate-500 font-mono text-[10px]">Skills to prep:</span>
                  {job.missingSkills.map(s => (
                    <span
                      key={s}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer row with salary & apply */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-[#0F172A] dark:text-white text-xs">{job.salaryRange}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(job)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0052FF] transition-colors cursor-pointer"
                    title={isSaved ? "Saved" : "Save Job"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#0052FF]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="h-8 px-3 text-xs">
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guest Gating Banner */}
      {isGuest && jobs.length > 3 && (
        <div className="p-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Showing 3 preview jobs of {jobs.length} matches
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={onUnlockAllJobs}
          >
            Unlock All {jobs.length} Matches Free 🔓
          </Button>
        </div>
      )}
    </div>
  );
}
