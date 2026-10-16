"use client";

import { useState } from "react";
import { Mail, Calendar, Check, Copy, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactTrainingCard({
  className = "",
  compact = false
}: {
  className?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const email = "training@careerpilot.ai";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-xs hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Column */}
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>1-on-1 Mentorship</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Need personalized 1-on-1 guidance?
            </h3>
            <p className="text-sm text-slate-600 font-sans">
              Book a private session for live mock practice, bullet rewriting, and referral strategy.
            </p>
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                Live Mock Practice
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                ATS Bullet Overhaul
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                Off-Campus Strategy
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Clean Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[260px]">
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-mono text-[11px]">
              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{email}</span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500 cursor-pointer"
              title="Copy email"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href={`mailto:${email}?subject=Interested%20in%20Personalized%20CareerPilot%20Training`}
            className="w-full"
          >
            <Button variant="primary" size="md" className="w-full justify-center gap-2 group shadow-sm">
              <Calendar className="w-4 h-4" />
              <span>Book Mentoring Call</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
