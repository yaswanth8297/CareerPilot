"use client";

import { useState } from "react";
import { CheckSquare, Square, ExternalLink, Lock, Compass, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { RoadmapData, RoadmapWeek } from "@/lib/types";

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

  // Calculate completed tasks count
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
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden transition-all my-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-300 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Personalised 90-Day Roadmap</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">{roadmap.role} Track</h3>
            <p className="text-xs text-indigo-200 mt-1">1-2 hrs/day • Grounded with vetted free resources</p>
          </div>

          {/* Progress pill */}
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-300">{progressPercent}%</span>
            <p className="text-[10px] text-indigo-200 font-medium">Completed</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-4">
          <div
            className="bg-indigo-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Selection Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
        {(["Foundation", "Build", "Job Ready"] as const).map(phase => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-all ${
              selectedPhase === phase
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {phase === "Foundation" ? "1. Foundation" : phase === "Build" ? "2. Build" : "3. Job Ready"}
          </button>
        ))}
      </div>

      {/* Weeks List */}
      <div className="p-4 sm:p-5 space-y-4 max-h-[460px] overflow-y-auto">
        {currentWeeks.map(week => {
          if (week.isLocked) {
            return (
              <div
                key={week.weekNumber}
                className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/70 dark:bg-zinc-950/40 overflow-hidden"
              >
                <div className="filter blur-[3px] select-none pointer-events-none opacity-40">
                  <div className="font-bold text-sm">
                    Week {week.weekNumber}: {week.title}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{week.description}</p>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 dark:bg-zinc-900/80 backdrop-blur-[2px] p-4 text-center">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Week {week.weekNumber} is Locked</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-xs mt-0.5">
                    Guest preview includes Weeks 1-2. Free sign-up unlocks the full 12 weeks.
                  </p>
                  <button
                    onClick={onUnlockRoadmap}
                    className="mt-2 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    Unlock 12 Weeks Free 🔓
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={week.weekNumber}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Week {week.weekNumber}
                  </span>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{week.title}</h4>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium">
                  {week.phase}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{week.description}</p>

              {/* Topics tags */}
              <div className="flex flex-wrap gap-1.5">
                {week.topics.map(t => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Tasks checklist */}
              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Weekly Tasks</span>
                {week.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask && onToggleTask(week.weekNumber, task.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all text-xs"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <span
                      className={`flex-1 ${
                        task.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{task.estMinutes}m</span>
                  </div>
                ))}
              </div>

              {/* Grounded Resource Link */}
              {week.resourceUrl && (
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[11px]">Free Vetted Resource:</span>
                  <a
                    href={week.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
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
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Weeks 3-12 locked for guest preview
          </span>
          <button
            onClick={onUnlockRoadmap}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Unlock All 12 Weeks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
