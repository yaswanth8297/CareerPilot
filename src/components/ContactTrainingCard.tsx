"use client";

import { useState } from "react";
import { Mail, Phone, Globe, Sparkles, Calendar, Check, Copy, ArrowUpRight, GraduationCap } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
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
  const phone = "+91 98765 43210";
  const website = "www.careerpilot.ai/training";

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
      className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-md transition-all duration-300 ${className}`}
    >
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#0052FF]/5 dark:bg-[#0052FF]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column */}
        <div className="space-y-4 max-w-2xl">
          <SectionLabel pulse={true}>
            1-on-1 Mentorship & Acceleration
          </SectionLabel>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-display font-normal text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
              <span>Need personalized 1-on-1 guidance?</span>
              <Sparkles className="w-5 h-5 text-[#0052FF] animate-pulse-subtle hidden sm:inline" />
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Accelerate your placement readiness. Book a private 1-on-1 mentoring session for rigorous live mock interviews, ATS resume overhaul, and custom roadmap calibration.
            </p>
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 font-medium text-slate-700 dark:text-slate-300">
                🎯 Live Mock Interviews
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 font-medium text-slate-700 dark:text-slate-300">
                📄 ATS Bullet Rewriting
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 font-medium text-slate-700 dark:text-slate-300">
                🗺️ Off-Campus Referral Strategy
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Contact Details & CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]">
          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                <Mail className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>{email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-500"
                title="Copy email"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              <Phone className="w-3.5 h-3.5 text-[#0052FF]" />
              <span>{phone}</span>
            </div>
          </div>

          <a
            href={`mailto:${email}?subject=Interested%20in%20Personalized%20CareerPilot%20Training`}
            className="w-full"
          >
            <Button variant="primary" size="md" className="w-full justify-between group">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Book Mentoring Call</span>
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
