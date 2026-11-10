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
    <div className="w-full max-w-xl rounded-xl border border-[#E7E5DE] bg-white shadow-atelier overflow-hidden my-2">
      {/* Header */}
      <div className="bg-[#FAFAF8] p-5 sm:p-6 border-b border-[#E7E5DE]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <SectionLabel>90-Day Roadmap</SectionLabel>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#141518] pt-1">
              <span className="text-[#183059]">{roadmap.role}</span> Syllabus
            </h3>
            <p className="text-xs font-mono text-[#82858E]">
              1–2 hrs/day · Vetted free resources only
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white border border-[#E7E5DE] px-3 py-2 rounded-lg min-w-[76px] shrink-0">
            <span className="text-xl font-mono font-bold text-[#183059] tabular-nums">{progressPercent}%</span>
            <p className="text-[10px] text-[#82858E] font-mono uppercase">Done</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E7E5DE] h-1.5 rounded-full overflow-hidden mt-4">
          <div
            className="bg-[#183059] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Selection Tabs */}
      <div className="flex border-b border-[#E7E5DE] bg-[#F4F3EE]/60">
        {(["Foundation", "Build", "Job Ready"] as const).map(phase => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors cursor-pointer ${
              selectedPhase === phase
                ? "border-[#183059] text-[#183059] font-semibold bg-white"
                : "border-transparent text-[#52555E] hover:text-[#141518]"
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
                className="relative rounded-lg border border-[#E7E5DE] p-4 bg-[#FAFAF8] overflow-hidden"
              >
                <div className="filter blur-[3px] select-none pointer-events-none opacity-40">
                  <div className="font-semibold text-sm text-[#141518]">
                    Week {week.weekNumber}: {week.title}
                  </div>
                  <p className="text-xs text-[#52555E] mt-1">{week.description}</p>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-[2px] p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-[#F4F3EE] border border-[#E7E5DE] text-[#183059] flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#141518]">
                    Week {week.weekNumber} Locked (Guest Preview)
                  </h4>
                  <p className="text-[11px] text-[#52555E] max-w-xs mt-0.5">
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
              className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#183059]">
                    Week {week.weekNumber}
                  </span>
                  <h4 className="font-semibold text-sm text-[#141518]">{week.title}</h4>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-[#E7E5DE] text-[#52555E]">
                  {week.phase}
                </span>
              </div>

              <p className="text-xs text-[#52555E] leading-relaxed font-sans">{week.description}</p>

              {/* Topics tags */}
              <div className="flex flex-wrap gap-1.5">
                {week.topics.map(t => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-[#E7E5DE] text-[#52555E]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Tasks checklist */}
              <div className="space-y-2 pt-2 border-t border-[#E7E5DE]">
                <span className="font-mono text-[10px] font-semibold text-[#82858E] uppercase tracking-wider">
                  Weekly Tasks
                </span>
                {week.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask && onToggleTask(week.weekNumber, task.id)}
                    className="flex items-center gap-2.5 p-2 rounded-md bg-white border border-[#E7E5DE] cursor-pointer hover:border-[#183059]/40 transition-colors text-xs"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#166534] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#82858E] shrink-0" />
                    )}
                    <span
                      className={`flex-1 ${
                        task.completed ? "line-through text-[#82858E]" : "text-[#141518]"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-[#82858E] font-mono tabular-nums">{task.estMinutes}m</span>
                  </div>
                ))}
              </div>

              {/* Grounded Resource Link */}
              {week.resourceUrl && (
                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E7E5DE]/60">
                  <span className="text-[#82858E] font-mono text-[10px] uppercase">Vetted Guide</span>
                  <a
                    href={week.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#183059] hover:underline"
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
        <div className="px-5 py-3.5 bg-[#FAFAF8] border-t border-[#E7E5DE] flex items-center justify-between gap-2">
          <span className="text-xs text-[#52555E]">
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
