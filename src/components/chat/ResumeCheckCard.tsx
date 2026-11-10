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
      ? "text-[#166534]"
      : result.score >= 60
      ? "text-[#183059]"
      : "text-[#991B1B]";

  return (
    <div className="w-full max-w-xl rounded-xl border border-[#E7E5DE] bg-white shadow-atelier overflow-hidden my-2">
      {/* Header - Executive Dossier */}
      <div className="bg-[#FAFAF8] p-5 sm:p-6 border-b border-[#E7E5DE]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <SectionLabel>ATS Audit Report</SectionLabel>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#141518] pt-1">
              Target: <span className="text-[#183059]">{result.targetRole}</span>
            </h3>
            <p className="text-xs text-[#82858E] font-mono">
              Deterministic 100-point rubric · Fresher calibrated
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white border border-[#E7E5DE] px-3.5 py-2.5 rounded-lg min-w-[84px] shrink-0">
            <span className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums ${scoreColor}`}>
              {result.score}
            </span>
            <span className="text-[10px] text-[#82858E] font-mono uppercase tracking-wider">
              / 100 ATS
            </span>
          </div>
        </div>

        {/* Senior Verdict Callout */}
        <div className="mt-4 p-3.5 rounded-lg bg-white border border-[#E7E5DE] border-l-2 border-l-[#183059] text-xs sm:text-sm leading-relaxed">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#82858E] block mb-1">
            Advisor Verdict
          </span>
          <p className="text-[#141518] font-sans">{result.verdict}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E7E5DE] bg-[#F4F3EE]/60">
        <button
          onClick={() => setActiveTab("mistakes")}
          className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === "mistakes"
              ? "border-[#183059] text-[#183059] font-semibold bg-white"
              : "border-transparent text-[#52555E] hover:text-[#141518]"
          }`}
        >
          3 Fixable Mistakes
        </button>
        <button
          onClick={() => setActiveTab("breakdown")}
          className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === "breakdown"
              ? "border-[#183059] text-[#183059] font-semibold bg-white"
              : "border-transparent text-[#52555E] hover:text-[#141518]"
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
                    className="relative rounded-lg border border-[#E7E5DE] p-4 bg-[#FAFAF8] overflow-hidden"
                  >
                    <div className="filter blur-[4px] select-none pointer-events-none opacity-40">
                      <div className="font-semibold text-sm text-[#141518]">
                        Mistake #{m.id}: {m.title}
                      </div>
                      <p className="text-xs text-[#52555E] mt-1">{m.whatIsWrong}</p>
                      <div className="mt-2 p-2 bg-[#E7E5DE] rounded text-xs">{m.beforeExample}</div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-[2px] p-4 text-center">
                      <div className="w-8 h-8 rounded-lg bg-[#F4F3EE] border border-[#E7E5DE] text-[#183059] flex items-center justify-center mb-2">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#141518]">
                        Mistake #{m.id} Locked (Guest Preview)
                      </h4>
                      <p className="text-[11px] text-[#52555E] max-w-xs mt-0.5">
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
                  className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-[#141518] font-semibold text-sm">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#183059] text-white">
                      #{m.id}
                    </span>
                    <span>{m.title}</span>
                  </div>

                  <div className="text-xs text-[#52555E] space-y-1.5 font-sans leading-relaxed">
                    <p>
                      <strong className="text-[#141518]">Issue:</strong> {m.whatIsWrong}
                    </p>
                    <p>
                      <strong className="text-[#141518]">Impact:</strong> {m.whyItHurts}
                    </p>
                    <p>
                      <strong className="text-[#183059] font-semibold">Fix Strategy:</strong>{" "}
                      {m.howToFix}
                    </p>
                  </div>

                  {/* Before / After Diff Block */}
                  <div className="rounded-lg overflow-hidden border border-[#E7E5DE] text-xs font-mono">
                    <div className="bg-[#FEF2F2] p-3 border-b border-[#E7E5DE]">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#991B1B] block mb-1">
                        - Before (Weak Bullet)
                      </span>
                      <p className="text-[#141518] text-[11px]">{m.beforeExample}</p>
                    </div>
                    <div className="bg-[#F0FDF4] p-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#166534] block mb-1">
                        + After (ATS Calibrated)
                      </span>
                      <p className="text-[#141518] text-[11px] font-medium">
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
                  <span className="text-[#141518] font-medium">{item.name}</span>
                  <span className="font-mono font-semibold text-[#183059] tabular-nums">
                    {item.score} / {item.max} pts
                  </span>
                </div>
                <div className="w-full bg-[#F4F3EE] h-1.5 rounded-full overflow-hidden border border-[#E7E5DE]">
                  <div
                    className="bg-[#183059] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-[#FAFAF8] border-t border-[#E7E5DE] flex items-center justify-between gap-3">
        <button
          onClick={onReupload}
          className="text-xs font-medium text-[#52555E] hover:text-[#141518] flex items-center gap-1.5 transition-colors cursor-pointer"
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
