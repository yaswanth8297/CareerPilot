"use client";

import { useState } from "react";
import { Briefcase, AlertOctagon, ExternalLink, Bookmark, BookmarkCheck, ShieldAlert, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { JobListing } from "@/lib/types";

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

  // Preview shows 2-3 jobs for guests; all for registered
  const visibleJobs = isGuest ? jobs.slice(0, 3) : jobs;
  const filteredJobs =
    filterType === "all" ? visibleJobs : visibleJobs.filter(j => j.jobType.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden transition-all my-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-900 text-white p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-300 mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Skill-Matched Jobs</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Curated Jobs for You</h3>
            <p className="text-xs text-emerald-200 mt-1">
              Unbiased matching • Scams auto-flagged • No college-tier prejudice
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            {jobs.length} Opportunities
          </span>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 overflow-x-auto text-xs">
        <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
        <button
          onClick={() => setFilterType("all")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            filterType === "all"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType("Fresher")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            filterType === "Fresher"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          }`}
        >
          Fresher Roles
        </button>
        <button
          onClick={() => setFilterType("Internship")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            filterType === "Internship"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          }`}
        >
          Internships
        </button>
      </div>

      {/* Jobs Feed */}
      <div className="p-4 sm:p-5 space-y-4 max-h-[500px] overflow-y-auto">
        {filteredJobs.map(job => {
          const isSaved = savedJobIds.includes(job.id);
          const isReported = reportedJobIds.includes(job.id);

          // Scam card formatting per PRD heuristics
          if (job.isScamSuspicious) {
            return (
              <div
                key={job.id}
                className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    ⚠️ WARNING: Suspicious Posting Flagged
                  </span>
                  <span className="text-[10px] text-zinc-500 font-normal">{job.postedDate}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white line-through opacity-80">
                    {job.title}
                  </h4>
                  <p className="text-xs text-zinc-500">{job.company}</p>
                </div>

                <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-lg text-xs text-rose-800 dark:text-rose-300 space-y-1">
                  <p className="font-bold">CareerPilot Advisory (Heuristics detected):</p>
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
                    className="text-rose-600 dark:text-rose-400 font-semibold hover:underline text-[11px]"
                  >
                    {isReported ? "✓ Reported for moderation" : "Report this scam"}
                  </button>
                  <span className="text-[10px] text-zinc-400 italic">Do not pay money for jobs!</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={job.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30 p-4 space-y-3 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{job.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {job.company} • {job.location} {job.isRemote && "• Remote"}
                  </p>
                </div>

                {/* Match percentage pill */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">
                  <Sparkles className="w-3 h-3" />
                  <span>{job.matchPercent}% Match</span>
                </div>
              </div>

              {/* High CGPA Warning badge if present (per PRD: flagged, not hidden) */}
              {job.hasCgpaFilter && (
                <div className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[11px] font-medium flex items-center gap-1.5 border border-amber-200 dark:border-amber-800">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  <span>Note: Explicit criteria mentioned ({job.minCgpaRequired}+ CGPA requested).</span>
                </div>
              )}

              {/* Why it matches */}
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-emerald-700 dark:text-emerald-400">Why matched:</strong> {job.whyItMatches}
              </p>

              {/* Missing skills tags */}
              {job.missingSkills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="text-zinc-500">Skills to prep:</span>
                  {job.missingSkills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer row with salary & apply */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900 dark:text-white text-xs">{job.salaryRange}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(job)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    title={isSaved ? "Saved" : "Save Job"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Apply Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guest Gating Banner */}
      {isGuest && jobs.length > 3 && (
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Showing 3 preview jobs of {jobs.length} matches
          </span>
          <button
            onClick={onUnlockAllJobs}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
          >
            Unlock All {jobs.length} Matches Free 🔓
          </button>
        </div>
      )}
    </div>
  );
}
