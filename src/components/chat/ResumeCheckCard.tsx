"use client";

import { useState } from "react";
import { Lock, ArrowRight, RefreshCw } from "lucide-react";
import { ResumeAnalysisResult } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function ResumeCheckCard({
  result,
  onUnlockMistakes,
  onReupload
}: {
  result: ResumeAnalysisResult;
  onUnlockMistakes?: () => void;
  onReupload?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"mistakes" | "breakdown">("mistakes");

  const scoreColor =
    result.score >= 80
      ? "text-pass"
      : result.score >= 60
      ? "text-brand-ink"
      : "text-fix";

  return (
    <div className="w-full max-w-xl rounded-xl border border-hairline bg-paper shadow-atelier overflow-hidden my-2">
      {/* Header */}
      <div className="bg-canvas p-5 sm:p-6 border-b border-hairline">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <SectionLabel>ATS Audit Report</SectionLabel>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink pt-1">
              Target: <span className="text-brand-ink">{result.targetRole}</span>
            </h3>
            <p className="text-xs text-ink-subtle font-mono">
              Deterministic 100-point rubric · Fresher calibrated
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-paper border border-hairline px-3.5 py-2.5 rounded-lg min-w-[84px] shrink-0">
            <span className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums ${scoreColor}`}>
              {result.score}
            </span>
            <span className="text-[10px] text-ink-subtle font-mono uppercase tracking-wider">
              / 100 ATS
            </span>
          </div>
        </div>

        {/* Senior Verdict Callout */}
        <div className="mt-4 p-3.5 rounded-lg bg-paper border border-hairline border-l-2 border-l-brand text-xs sm:text-sm leading-relaxed">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle block mb-1">
            Advisor Verdict
          </span>
          <p className="text-ink font-sans">{result.verdict}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-hairline bg-inset/60">
        <button
          onClick={() => setActiveTab("mistakes")}
          className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === "mistakes"
              ? "border-brand text-brand-ink font-semibold bg-paper"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          3 Fixable Mistakes
        </button>
        <button
          onClick={() => setActiveTab("breakdown")}
          className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === "breakdown"
              ? "border-brand text-brand-ink font-semibold bg-paper"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Score Rubric (5 Pillars)
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 space-y-4">
        {activeTab === "mistakes" ? (
          <div className="space-y-4">
            {result.mistakes.map((m) => {
              if (m.isLocked) {
                return (
                  <div
                    key={m.id}
                    className="relative rounded-lg border border-hairline p-4 bg-canvas overflow-hidden"
                  >
                    <div className="filter blur-[4px] select-none pointer-events-none opacity-40">
                      <div className="font-semibold text-sm text-ink">
                        Mistake #{m.id}: {m.title}
                      </div>
                      <p className="text-xs text-ink-muted mt-1">{m.whatIsWrong}</p>
                      <div className="mt-2 p-2 bg-inset rounded text-xs">{m.beforeExample}</div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/90 backdrop-blur-[2px] p-4 text-center">
                      <div className="w-8 h-8 rounded-lg bg-inset border border-hairline text-brand-ink flex items-center justify-center mb-2">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-ink">
                        Mistake #{m.id} Locked (Guest Preview)
                      </h4>
                      <p className="text-[11px] text-ink-muted max-w-xs mt-0.5">
                        Free sign-up unlocks the exact before-and-after bullet rewrite.
                      </p>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={onUnlockMistakes}
                        className="mt-2.5"
                      >
                        Unlock Mistake #{m.id}
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className="rounded-lg border border-hairline bg-canvas p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-ink font-semibold text-sm">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-brand text-white">
                      #{m.id}
                    </span>
                    <span>{m.title}</span>
                  </div>

                  <div className="text-xs text-ink-muted space-y-1.5 font-sans leading-relaxed">
                    <p>
                      <strong className="text-ink">Issue:</strong> {m.whatIsWrong}
                    </p>
                    <p>
                      <strong className="text-ink">Impact:</strong> {m.whyItHurts}
                    </p>
                    <p>
                      <strong className="text-brand-ink font-semibold">Fix Strategy:</strong>{" "}
                      {m.howToFix}
                    </p>
                  </div>

                  {/* Before / After Diff Block */}
                  <div className="rounded-lg overflow-hidden border border-hairline text-xs font-mono">
                    <div className="bg-fix-bg p-3 border-b border-hairline">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-fix block mb-1">
                        - Before (Weak Bullet)
                      </span>
                      <p className="text-ink text-[11px]">{m.beforeExample}</p>
                    </div>
                    <div className="bg-pass-bg p-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-pass block mb-1">
                        + After (ATS Calibrated)
                      </span>
                      <p className="text-ink text-[11px] font-medium">
                        {m.afterExample}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { name: "Target Keyword Match", score: result.breakdown.keywordMatch, max: 30 },
              { name: "Formatting & ATS Parseability", score: result.breakdown.formatting, max: 20 },
              { name: "Quantified Impact & Metrics", score: result.breakdown.quantifiedImpact, max: 20 },
              { name: "Section Completeness & Order", score: result.breakdown.sectionCompleteness, max: 15 },
              { name: "Length, Clarity & Grammar", score: result.breakdown.lengthAndClarity, max: 15 }
            ].map(item => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-ink font-medium">{item.name}</span>
                  <span className="font-mono font-semibold text-brand-ink tabular-nums">
                    {item.score} / {item.max} pts
                  </span>
                </div>
                <div className="w-full bg-inset h-1.5 rounded-full overflow-hidden border border-hairline">
                  <div
                    className="bg-brand h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-canvas border-t border-hairline flex items-center justify-between gap-3">
        <button
          onClick={onReupload}
          className="text-xs font-medium text-ink-muted hover:text-ink flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Upload Another Resume</span>
        </button>

        {result.mistakes.some(m => m.isLocked) && (
          <Button
            size="sm"
            variant="primary"
            onClick={onUnlockMistakes}
            className="group"
          >
            <span>Unlock All 3 Fixes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
}
