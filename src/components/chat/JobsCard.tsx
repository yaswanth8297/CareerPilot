"use client";

import { useState } from "react";
import { AlertOctagon, ExternalLink, Bookmark, BookmarkCheck, ShieldAlert, Filter } from "lucide-react";
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
    <div className="w-full max-w-xl rounded-xl border border-[#E7E5DE] bg-white shadow-atelier overflow-hidden my-2">
      {/* Header */}
      <div className="bg-[#FAFAF8] p-5 sm:p-6 border-b border-[#E7E5DE]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <SectionLabel>Verified Roles</SectionLabel>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#141518] pt-1">
              Curated Fresher Openings
            </h3>
            <p className="text-xs font-mono text-[#82858E]">
              Skill-ranked · Scams flagged · Zero pedigree filter
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-white text-[#183059] font-semibold border border-[#E7E5DE] shrink-0 tabular-nums">
            {jobs.length} Matches
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#E7E5DE] bg-[#F4F3EE]/60 overflow-x-auto text-xs">
        <Filter className="w-3.5 h-3.5 text-[#82858E] shrink-0 mr-1" />
        {(["all", "Fresher", "Internship"] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === type
                ? "bg-[#183059] text-white"
                : "bg-white border border-[#E7E5DE] text-[#52555E] hover:text-[#141518]"
            }`}
          >
            {type === "all" ? "All" : type === "Fresher" ? "Fresher Roles" : "Internships"}
          </button>
        ))}
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
                className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between text-[#991B1B] font-semibold text-xs">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    Suspicious Posting Flagged
                  </span>
                  <span className="text-[10px] text-[#82858E] font-mono">{job.postedDate}</span>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-[#141518] line-through opacity-75">
                    {job.title}
                  </h4>
                  <p className="text-xs text-[#52555E]">{job.company}</p>
                </div>

                <div className="bg-white/80 border border-[#FECACA] p-2.5 rounded-md text-xs text-[#991B1B] space-y-1">
                  <p className="font-semibold text-[11px]">Scam Shield Advisory:</p>
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
                    className="text-[#991B1B] font-semibold hover:underline text-[11px] cursor-pointer"
                  >
                    {isReported ? "Reported for moderation" : "Report listing"}
                  </button>
                  <span className="text-[10px] text-[#82858E] font-mono">Never pay fees for jobs</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={job.id}
              className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-4 space-y-3 hover:border-[#183059]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm text-[#141518]">{job.title}</h4>
                  <p className="text-xs text-[#52555E] mt-0.5">
                    {job.company} · {job.location} {job.isRemote && "· Remote"}
                  </p>
                </div>

                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] shrink-0 tabular-nums">
                  {job.matchPercent}% Match
                </span>
              </div>

              {job.hasCgpaFilter && (
                <div className="px-2.5 py-1.5 rounded-md bg-[#FEF3C7] text-[#92400E] text-[11px] font-medium flex items-center gap-1.5 border border-[#FDE68A]">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  <span>Note: Employer requests {job.minCgpaRequired}+ CGPA.</span>
                </div>
              )}

              <p className="text-xs text-[#52555E] leading-relaxed font-sans">
                <strong className="text-[#141518] font-medium">Rationale:</strong> {job.whyItMatches}
              </p>

              {job.missingSkills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="text-[#82858E] font-mono text-[10px]">Prep:</span>
                  {job.missingSkills.map(s => (
                    <span
                      key={s}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-[#E7E5DE] text-[#52555E]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2.5 border-t border-[#E7E5DE] flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-[#141518] text-xs">{job.salaryRange}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(job)}
                    className="p-1.5 rounded-md text-[#82858E] hover:text-[#183059] transition-colors cursor-pointer"
                    title={isSaved ? "Saved" : "Save Job"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#183059]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm">
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
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
        <div className="px-5 py-3.5 bg-[#FAFAF8] border-t border-[#E7E5DE] flex items-center justify-between gap-2">
          <span className="text-xs text-[#52555E]">
            Showing 3 preview roles of {jobs.length}
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={onUnlockAllJobs}
          >
            Unlock All {jobs.length} Matches
          </Button>
        </div>
      )}
    </div>
  );
}
