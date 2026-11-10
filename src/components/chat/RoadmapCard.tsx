"use client";

import { useState } from "react";
import { CheckSquare, Square, ExternalLink, Lock, ChevronRight } from "lucide-react";
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
    <div className="w-full max-w-xl rounded-xl border border-hairline bg-paper shadow-atelier overflow-hidden my-2">
      {/* Header */}
      <div className="bg-canvas p-5 sm:p-6 border-b border-hairline">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <SectionLabel>90-Day Roadmap</SectionLabel>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink pt-1">
              <span className="text-brand-ink">{roadmap.role}</span> Syllabus
            </h3>
            <p className="text-xs font-mono text-ink-subtle">
              1–2 hrs/day · Vetted free resources only
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-paper border border-hairline px-3 py-2 rounded-lg min-w-[76px] shrink-0">
            <span className="text-xl font-mono font-bold text-brand-ink tabular-nums">{progressPercent}%</span>
            <p className="text-[10px] text-ink-subtle font-mono uppercase">Done</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-inset h-1.5 rounded-full overflow-hidden mt-4 border border-hairline">
          <div
            className="bg-brand h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Selection Tabs */}
      <div className="flex border-b border-hairline bg-inset/60">
        {(["Foundation", "Build", "Job Ready"] as const).map(phase => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors cursor-pointer ${
              selectedPhase === phase
                ? "border-brand text-brand-ink font-semibold bg-paper"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {phase === "Foundation" ? "01. Foundation" : phase === "Build" ? "02. Build" : "03. Job Ready"}
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
                className="relative rounded-lg border border-hairline p-4 bg-canvas overflow-hidden"
              >
                <div className="filter blur-[3px] select-none pointer-events-none opacity-40">
                  <div className="font-semibold text-sm text-ink">
                    Week {week.weekNumber}: {week.title}
                  </div>
                  <p className="text-xs text-ink-muted mt-1">{week.description}</p>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/90 backdrop-blur-[2px] p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-inset border border-hairline text-brand-ink flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-ink">
                    Week {week.weekNumber} Locked (Guest Preview)
                  </h4>
                  <p className="text-[11px] text-ink-muted max-w-xs mt-0.5">
                    Guest mode covers Weeks 1–2. Sign up free to unlock the full 12-week plan.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onUnlockRoadmap}
                    className="mt-2.5"
                  >
                    Unlock 12 Weeks Free
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={week.weekNumber}
              className="rounded-lg border border-hairline bg-canvas p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-ink">
                    Week {week.weekNumber}
                  </span>
                  <h4 className="font-semibold text-sm text-ink">{week.title}</h4>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-paper border border-hairline text-ink-muted">
                  {week.phase}
                </span>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed font-sans">{week.description}</p>

              {/* Topics tags */}
              <div className="flex flex-wrap gap-1.5">
                {week.topics.map(t => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-paper border border-hairline text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Tasks checklist */}
              <div className="space-y-2 pt-2 border-t border-hairline">
                <span className="font-mono text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">
                  Weekly Tasks
                </span>
                {week.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask && onToggleTask(week.weekNumber, task.id)}
                    className="flex items-center gap-2.5 p-2 rounded-md bg-paper border border-hairline cursor-pointer hover:border-brand-ink/40 transition-colors text-xs"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-pass shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-ink-subtle shrink-0" />
                    )}
                    <span
                      className={`flex-1 ${
                        task.completed ? "line-through text-ink-subtle" : "text-ink"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-ink-subtle font-mono tabular-nums">{task.estMinutes}m</span>
                  </div>
                ))}
              </div>

              {/* Grounded Resource Link */}
              {week.resourceUrl && (
                <div className="pt-2 flex items-center justify-between text-xs border-t border-hairline/60">
                  <span className="text-ink-subtle font-mono text-[10px] uppercase">Vetted Guide</span>
                  <a
                    href={week.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-brand-ink hover:underline"
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
        <div className="px-5 py-3.5 bg-canvas border-t border-hairline flex items-center justify-between gap-2">
          <span className="text-xs text-ink-muted">
            Weeks 3–12 locked for guest preview
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
