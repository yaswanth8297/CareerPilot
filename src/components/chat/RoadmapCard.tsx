"use client";

import { useState } from "react";
import { CheckSquare, Square, ExternalLink, Lock, Compass, ChevronRight, CheckCircle2 } from "lucide-react";
import { RoadmapData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function RoadmapCard({
  roadmap,
  onToggleTask,
  onUnlockRoadmap
}: {
  roadmap: RoadmapData;
  onToggleTask?: (weekNumber: number, taskId: string) => void;
  onUnlockRoadmap?: () => void;
}) {
  const [selectedPhase, setSelectedPhase] = useState<"Foundation" | "Build" | "Job Ready">("Foundation");

  let totalTasks = 0;
  let completedTasks = 0;
  roadmap.weeks.forEach(w => {
    w.tasks.forEach(t => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const currentWeeks = roadmap.weeks.filter(w => w.phase === selectedPhase);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-saas overflow-hidden transition-all my-3">
      {/* Light Theme Header */}
      <div className="relative bg-gradient-to-br from-blue-50/80 via-white to-slate-50 text-slate-900 p-5 sm:p-6 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 dot-pattern-light opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <SectionLabel pulse={true} className="mb-2.5">
              90-DAY ROADMAP
            </SectionLabel>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              <span className="text-blue-600">{roadmap.role}</span> Track
            </h3>
            <p className="text-xs text-slate-500 mt-1">1-2 hrs/day • Grounded with vetted free resources</p>
          </div>

          {/* Progress pill */}
          <div className="flex flex-col items-center justify-center bg-white border border-slate-200 p-2.5 rounded-2xl min-w-[76px] shrink-0 shadow-xs">
            <span className="text-2xl font-mono font-bold text-blue-600">{progressPercent}%</span>
            <p className="text-[10px] text-slate-400 font-mono">Progress</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-4">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Selection Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {(["Foundation", "Build", "Job Ready"] as const).map(phase => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium text-center border-b-2 transition-all cursor-pointer ${
              selectedPhase === phase
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {phase === "Foundation" ? "1. Foundation" : phase === "Build" ? "2. Build" : "3. Job Ready"}
          </button>
        ))}
      </div>

      {/* Weeks List */}
      <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto">
        {currentWeeks.map(week => {
          if (week.isLocked) {
            return (
              <div
                key={week.weekNumber}
                className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-900/40 overflow-hidden"
              >
                <div className="filter blur-[3px] select-none pointer-events-none opacity-40">
                  <div className="font-semibold text-sm">
                    Week {week.weekNumber}: {week.title}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{week.description}</p>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0F172A]/85 backdrop-blur-[2px] p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center mb-1.5 shadow-sm">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white">
                    Week {week.weekNumber} is Locked (Guest Preview)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mt-0.5">
                    Guest preview includes Weeks 1-2. Free sign-up unlocks the full 12 weeks.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onUnlockRoadmap}
                    className="mt-2.5"
                  >
                    Unlock 12 Weeks Free 🔓
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={week.weekNumber}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF] dark:text-[#4D7CFF]">
                    Week {week.weekNumber}
                  </span>
                  <h4 className="font-semibold text-sm text-[#0F172A] dark:text-white">{week.title}</h4>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#0052FF]/10 text-[#0052FF] dark:text-[#4D7CFF] font-medium">
                  {week.phase}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{week.description}</p>

              {/* Topics tags */}
              <div className="flex flex-wrap gap-1.5">
                {week.topics.map(t => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Tasks checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Weekly Tasks</span>
                {week.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask && onToggleTask(week.weekNumber, task.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-[#0052FF]/40 transition-all text-xs"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#0052FF] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`flex-1 ${
                        task.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{task.estMinutes}m</span>
                  </div>
                ))}
              </div>

              {/* Grounded Resource Link */}
              {week.resourceUrl && (
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Free Vetted Guide:</span>
                  <a
                    href={week.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#0052FF] dark:text-[#4D7CFF] hover:underline"
                  >
                    <span className="max-w-[200px] truncate">{week.resourceTitle}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA if locked */}
      {roadmap.weeks.some(w => w.isLocked) && (
        <div className="p-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Weeks 3-12 locked for guest preview
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={onUnlockRoadmap}
            className="group"
          >
            <span>Unlock All 12 Weeks</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}
