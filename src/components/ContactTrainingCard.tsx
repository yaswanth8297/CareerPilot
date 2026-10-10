"use client";

import { useState } from "react";
import { Mail, Phone, Globe, Sparkles, Calendar, Check, Copy, ArrowUpRight, GraduationCap } from "lucide-react";

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
      className={`relative overflow-hidden rounded-3xl border border-orange-200/80 dark:border-orange-500/20 bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-indigo-50/40 dark:from-zinc-900/90 dark:via-zinc-900/60 dark:to-orange-950/20 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-orange-500/5 transition-all ${className}`}
    >
      {/* Background decorative glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-orange-500/20 to-amber-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-indigo-500/15 to-orange-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Heading, Badge, Description */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>1-on-1 Mentorship & Acceleration</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Need personalized guidance?</span>
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse hidden sm:inline" />
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Take your career prep to the next level. Book a 1-on-1 personalized training session with our expert mentors for deep-dive mock interviews, resume rewriting, and custom career roadmapping.
            </p>
          </div>

          {/* Value Badges */}
          {!compact && (
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 font-semibold text-zinc-700 dark:text-zinc-300">
                🎯 Live Mock Interviews
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 font-semibold text-zinc-700 dark:text-zinc-300">
                📄 Line-by-Line Resume Overhaul
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 font-semibold text-zinc-700 dark:text-zinc-300">
                🗺️ Tailored 90-Day Placement Plan
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Contact Details Card */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-3 min-w-[280px]">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Direct Contact Channels
            </div>

            {/* Email */}
            <div className="flex items-center justify-between group">
              <a
                href={`mailto:${email}?subject=1-on-1%20Career%20Training%20Inquiry`}
                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{email}</span>
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                title="Copy Email"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5">
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{phone}</span>
              </a>
            </div>

            {/* Website */}
            <div className="flex items-center gap-2.5">
              <a
                href={`https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <span>{website}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
              </a>
            </div>
          </div>

          {/* Action CTA Button */}
          <a
            href={`mailto:${email}?subject=Booking%20Request:%201-on-1%20Personalized%20Training&body=Hi%20CareerPilot%20Team,%0A%0AI%20would%20like%20to%20book%20a%201-on-1%20training%20session%20for%20personalized%20career%20guidance.`}
            className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book 1-on-1 Session</span>
          </a>
        </div>
      </div>
    </div>
  );
}
