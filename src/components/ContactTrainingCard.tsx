"use client";

import { useState } from "react";
import { Mail, Calendar, Check, Copy, ArrowUpRight } from "lucide-react";
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
      className={`rounded-xl border border-[#E7E5DE] bg-white p-7 sm:p-10 shadow-atelier ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Column - Editorial Memo */}
        <div className="space-y-4 max-w-xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#82858E]">
            Advisory &amp; Coaching
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-display font-normal text-[#141518] tracking-tight leading-snug">
              Need personalized 1-on-1 guidance?
            </h3>
            <p className="text-sm text-[#52555E] leading-relaxed">
              Book a private session for live mock interview drills, line-by-line bullet rewriting, and off-campus referral strategy.
            </p>
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs text-[#52555E] font-mono">
              <span>• Live Mock Practice</span>
              <span>• ATS Bullet Overhaul</span>
              <span>• Off-Campus Strategy</span>
            </div>
          )}
        </div>

        {/* Right Column: Clean Actions */}
        <div className="flex flex-col gap-3 min-w-[260px] lg:border-l lg:border-[#E7E5DE] lg:pl-8">
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-xs">
            <div className="flex items-center gap-2 text-[#141518] font-mono text-[11px]">
              <Mail className="w-3.5 h-3.5 text-[#52555E] shrink-0" />
              <span>{email}</span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="p-1 hover:bg-[#ECEBE4] rounded transition-colors text-[#52555E] cursor-pointer"
              title="Copy email"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#166534]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href={`mailto:${email}?subject=Interested%20in%20Personalized%20CareerPilot%20Training`}
            className="w-full"
          >
            <Button variant="primary" size="md" className="w-full justify-center gap-2 group">
              <Calendar className="w-4 h-4" />
              <span>Book Mentoring Call</span>
              <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
