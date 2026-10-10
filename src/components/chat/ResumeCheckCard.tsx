"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Lock, ArrowRight, Sparkles, FileText, UploadCloud, RefreshCw } from "lucide-react";
import { ResumeAnalysisResult } from "@/lib/types";

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
    result.score >= 80 ? "text-emerald-500" : result.score >= 60 ? "text-amber-500" : "text-rose-500";

  const scoreBg =
    result.score >= 80 ? "bg-emerald-500" : result.score >= 60 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden transition-all my-3">
      {/* Header with ATS Score Meter */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-5 sm:p-6 relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-orange-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Resume Score</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">ATS Audit for {result.targetRole}</h3>
            <p className="text-xs text-zinc-300 mt-1">
              Deterministic 100-point rubric breakdown for Tier 2/3 placements
            </p>
          </div>

          {/* Circular Score Badge */}
          <div className="flex flex-col items-center justify-center bg-zinc-950/80 p-3 rounded-2xl border border-zinc-700/80 min-w-[76px]">
            <span className={`text-3xl font-black ${scoreColor}`}>{result.score}</span>
            <span className="text-[10px] text-zinc-400 font-medium">/ 100</span>
          </div>
        </div>

        {/* Friendly Senior Verdict */}
        <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
          <span className="text-lg">💡</span>
          <p className="text-zinc-200 font-medium">{result.verdict}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
        <button
          onClick={() => setActiveTab("mistakes")}
          className={`flex-1 py-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-all ${
            activeTab === "mistakes"
              ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          3 Fixable Mistakes
        </button>
        <button
          onClick={() => setActiveTab("breakdown")}
          className={`flex-1 py-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-all ${
            activeTab === "breakdown"
              ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Score Rubric (5 Pillars)
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {activeTab === "mistakes" ? (
          <div className="space-y-4">
            {result.mistakes.map((m, idx) => {
              if (m.isLocked) {
                return (
                  <div
                    key={m.id}
                    className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/70 dark:bg-zinc-950/40 overflow-hidden"
                  >
                    <div className="filter blur-[4px] select-none pointer-events-none opacity-40">
                      <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                        Mistake #{m.id}: {m.title}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{m.whatIsWrong}</p>
                      <div className="mt-2 p-2 bg-zinc-200 rounded text-xs">{m.beforeExample}</div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-zinc-900/80 backdrop-blur-[2px] p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5 shadow-sm">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                        Mistake #{m.id} is Locked (Guest Preview)
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs mt-0.5">
                        Free sign-up unlocks the Before → After bullet fix and keywords.
                      </p>
                      <button
                        onClick={onUnlockMistakes}
                        className="mt-2.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm"
                      >
                        Unlock Mistake #{m.id} Free 🔓
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Mistake #{m.id}: {m.title}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5">
                    <p>
                      <strong className="text-zinc-900 dark:text-white">Kya galti hai:</strong> {m.whatIsWrong}
                    </p>
                    <p>
                      <strong className="text-zinc-900 dark:text-white">Kyu nuksaan hota hai:</strong> {m.whyItHurts}
                    </p>
                    <p>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Kaise fix karein:</strong>{" "}
                      {m.howToFix}
                    </p>
                  </div>

                  {/* Before / After comparison */}
                  <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 text-xs">
                    <div className="bg-rose-50 dark:bg-rose-950/30 p-2.5 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="font-bold text-rose-600 dark:text-rose-400 block mb-0.5">❌ Before (Weak):</span>
                      <p className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{m.beforeExample}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        ✅ After (ATS Ready):
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200 font-mono text-[11px] font-medium">
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
          <div className="space-y-3">
            {[
              { name: "Target Keyword Match", score: result.breakdown.keywordMatch, max: 30 },
              { name: "Formatting & ATS Parseability", score: result.breakdown.formatting, max: 20 },
              { name: "Quantified Impact & Metrics", score: result.breakdown.quantifiedImpact, max: 20 },
              { name: "Section Completeness & Order", score: result.breakdown.sectionCompleteness, max: 15 },
              { name: "Length, Clarity & Grammar", score: result.breakdown.lengthAndClarity, max: 15 }
            ].map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {item.score} / {item.max} pts
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
        <button
          onClick={onReupload}
          className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Upload Another Resume</span>
        </button>

        {result.mistakes.some(m => m.isLocked) && (
          <button
            onClick={onUnlockMistakes}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-1.5"
          >
            <span>Unlock All 3 Fixes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
