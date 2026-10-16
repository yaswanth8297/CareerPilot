"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Lock, ArrowRight, Sparkles, FileText, UploadCloud, RefreshCw } from "lucide-react";
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
    result.score >= 80 ? "text-emerald-500" : result.score >= 60 ? "text-[#0052FF]" : "text-rose-500";

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-saas overflow-hidden transition-all my-3">
      {/* Header with Light Theme & ATS Score Meter */}
      <div className="relative bg-gradient-to-br from-blue-50/80 via-white to-slate-50 text-slate-900 p-5 sm:p-6 overflow-hidden border-b border-slate-200">
        {/* Subtle dot pattern texture */}
        <div className="absolute inset-0 dot-pattern-light opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <SectionLabel pulse={true} className="mb-2.5">
              ATS AUDIT RESULT
            </SectionLabel>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              ATS Audit for <span className="text-blue-600">{result.targetRole}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic 100-point rubric breakdown for Tier 2/3 placements
            </p>
          </div>

          {/* Circular / Monospace Score Badge */}
          <div className="flex flex-col items-center justify-center bg-white border border-slate-200 p-3 rounded-2xl min-w-[80px] shrink-0 shadow-xs">
            <span className={`text-3xl font-mono font-bold ${scoreColor}`}>{result.score}</span>
            <span className="text-[10px] text-slate-400 font-mono">/ 100 ATS</span>
          </div>
        </div>

        {/* Friendly Senior Verdict */}
        <div className="relative z-10 mt-4 p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed shadow-xs">
          <span className="text-base">💡</span>
          <p className="text-slate-700 font-sans font-medium">{result.verdict}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab("mistakes")}
          className={`flex-1 py-3 text-xs sm:text-sm font-medium text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "mistakes"
              ? "border-blue-600 text-blue-600 font-semibold bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          3 Fixable Mistakes
        </button>
        <button
          onClick={() => setActiveTab("breakdown")}
          className={`flex-1 py-3 text-xs sm:text-sm font-medium text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "breakdown"
              ? "border-blue-600 text-blue-600 font-semibold bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
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
                    className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-900/40 overflow-hidden"
                  >
                    <div className="filter blur-[4px] select-none pointer-events-none opacity-40">
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                        Mistake #{m.id}: {m.title}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{m.whatIsWrong}</p>
                      <div className="mt-2 p-2 bg-slate-200 dark:bg-slate-800 rounded text-xs">{m.beforeExample}</div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0F172A]/85 backdrop-blur-[2px] p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center mb-1.5 shadow-sm">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white">
                        Mistake #{m.id} is Locked (Guest Preview)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mt-0.5">
                        Free sign-up unlocks the Before → After bullet fix and keywords.
                      </p>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={onUnlockMistakes}
                        className="mt-2.5"
                      >
                        Unlock Mistake #{m.id} Free 🔓
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-[#0052FF] dark:text-[#4D7CFF] font-semibold text-sm">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0052FF]/10">#{m.id}</span>
                    <span>{m.title}</span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-sans leading-relaxed">
                    <p>
                      <strong className="text-[#0F172A] dark:text-white">Issue:</strong> {m.whatIsWrong}
                    </p>
                    <p>
                      <strong className="text-[#0F172A] dark:text-white">Impact:</strong> {m.whyItHurts}
                    </p>
                    <p>
                      <strong className="text-[#0052FF] dark:text-[#4D7CFF] font-semibold">Fix Strategy:</strong>{" "}
                      {m.howToFix}
                    </p>
                  </div>

                  {/* Before / After comparison */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="bg-rose-500/5 dark:bg-rose-950/20 p-3 border-b border-slate-200 dark:border-slate-800">
                      <span className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-1">
                        ❌ Before (Weak Bullet):
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{m.beforeExample}</p>
                    </div>
                    <div className="bg-emerald-500/5 dark:bg-emerald-950/20 p-3">
                      <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        ✅ After (ATS Calibrated):
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-mono text-[11px] font-medium">
                        {m.afterExample}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Rubric breakdown */
          <div className="space-y-3.5">
            {[
              { name: "Target Keyword Match", score: result.breakdown.keywordMatch, max: 30 },
              { name: "Formatting & ATS Parseability", score: result.breakdown.formatting, max: 20 },
              { name: "Quantified Impact & Metrics", score: result.breakdown.quantifiedImpact, max: 20 },
              { name: "Section Completeness & Order", score: result.breakdown.sectionCompleteness, max: 15 },
              { name: "Length, Clarity & Grammar", score: result.breakdown.lengthAndClarity, max: 15 }
            ].map(item => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                  <span className="font-mono font-semibold text-[#0F172A] dark:text-white">
                    {item.score} / {item.max} pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={onReupload}
          className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
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
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
}
