"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Compass,
  Briefcase,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import RegistrationModal from "@/components/modals/RegistrationModal";
import ContactTrainingCard from "@/components/ContactTrainingCard";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [chatIntent, setChatIntent] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const intentParam = params.get("intent");
      const openChatParam = params.get("openChat");
      if (intentParam || openChatParam === "true") {
        if (intentParam) setChatIntent(intentParam);
        setChatWidgetOpen(true);
      }
    }
  }, []);

  const handleFeatureClick = (intent: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      router.push(`/chat?intent=${encodeURIComponent(intent)}`);
    } else {
      setChatIntent(intent);
      setChatWidgetOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans paper-grain">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Editorial Poster Hero Section */}
      <section className="pt-14 pb-20 sm:pt-20 sm:pb-28 border-b border-hairline">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
          {/* Top Monospace Ticker Strip (Coral Dot Separators) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
            <span>Audit</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cta" />
            <span>Roadmap</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cta" />
            <span>Verified Roles</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cta" />
            <span>Mock Drills</span>
          </div>

          {/* Giant Condensed Botanical Green Display Title */}
          <div className="text-center">
            <h1 className="font-poster uppercase text-brand-ink text-[58px] sm:text-[98px] lg:text-[134px] leading-[0.9] tracking-[0.01em] select-none">
              Career Pilot
              <span className="block text-[44px] sm:text-[74px] lg:text-[98px] text-ink mt-1 sm:mt-2">
                Zero Judgment.
              </span>
            </h1>
          </div>

          {/* Balanced Editorial Bottom Row (Mirroring Reference Composition) */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-10 pt-2 sm:pt-6 border-t border-hairline/70">
            {/* Left Manifesto & Coral Pill CTA */}
            <div className="space-y-6 max-w-md pt-4">
              <div className="w-7 h-px bg-ink" />
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.08em] leading-relaxed text-ink">
                Deterministic ATS resume audits, 90-day placement roadmaps, and mock interview practice for college students.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link href="/chat">
                  <Button variant="cta" size="lg" className="group">
                    <span>Start Career Chat</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleFeatureClick("resume_check")}
                  className="font-mono text-xs uppercase tracking-[0.1em]"
                >
                  Audit Resume
                </Button>
              </div>
            </div>

            {/* Right Architectural Feature Stack */}
            <div className="grid grid-cols-2 sm:flex sm:flex-col gap-5 sm:gap-4 pt-4 md:border-l md:border-hairline md:pl-10">
              <button
                onClick={() => handleFeatureClick("resume_check")}
                className="flex items-center gap-3.5 text-left group cursor-pointer"
              >
                <FileText className="w-5 h-5 text-brand-ink shrink-0 group-hover:scale-105 transition-transform" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-ink-muted group-hover:text-ink transition-colors leading-tight">
                  Deterministic<br />ATS Rubric
                </span>
              </button>

              <button
                onClick={() => handleFeatureClick("roadmap")}
                className="flex items-center gap-3.5 text-left group cursor-pointer"
              >
                <Compass className="w-5 h-5 text-brand-ink shrink-0 group-hover:scale-105 transition-transform" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-ink-muted group-hover:text-ink transition-colors leading-tight">
                  90-Day Skill<br />Roadmap
                </span>
              </button>

              <button
                onClick={() => handleFeatureClick("jobs")}
                className="flex items-center gap-3.5 text-left group cursor-pointer"
              >
                <Briefcase className="w-5 h-5 text-brand-ink shrink-0 group-hover:scale-105 transition-transform" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-ink-muted group-hover:text-ink transition-colors leading-tight">
                  Scam-Shielded<br />Fresher Jobs
                </span>
              </button>

              <button
                onClick={() => handleFeatureClick("mock_interview")}
                className="flex items-center gap-3.5 text-left group cursor-pointer"
              >
                <Award className="w-5 h-5 text-brand-ink shrink-0 group-hover:scale-105 transition-transform" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-ink-muted group-hover:text-ink transition-colors leading-tight">
                  5-Min Mock<br />Interviews
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Dossier Grid */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline pb-6">
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-subtle flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cta" />
                <span>02 / Core Toolkit</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-poster uppercase tracking-wide text-brand-ink">
                Everything Required to Get Hired
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted max-w-md font-sans">
              Purpose-built tools calibrated for Tier-2 and Tier-3 placements. Select any dossier to launch immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dossier Card 1: ATS Resume Checker */}
            <div
              onClick={() => handleFeatureClick("resume_check")}
              className="group cursor-pointer rounded-xl border border-hairline bg-paper p-6 sm:p-8 space-y-6 shadow-atelier hover:border-brand-ink/50 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
                    <FileText className="w-4 h-4 text-brand-ink" />
                    <span>01 · ATS Rubric</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-pass bg-pass-bg px-2.5 py-0.5 rounded-md border border-pass-border tabular-nums">
                    88 / 100
                  </span>
                </div>

                {/* Diff Preview Artifact */}
                <div className="rounded-lg border border-hairline bg-canvas p-3.5 font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-ink-subtle border-b border-hairline pb-1.5">
                    <span>BULLET_REWRITE.DIFF</span>
                    <span className="text-pass font-semibold">+14 pts</span>
                  </div>
                  <div className="text-fix line-through opacity-80 truncate">
                    - Built a React app for college students
                  </div>
                  <div className="text-pass font-medium truncate">
                    + Optimized React bundle load time by 38% via code splitting
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-ink group-hover:text-brand-ink transition-colors">
                    Deterministic ATS Audit
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Instant 100-point rubric score with 3 concrete before-and-after bullet rewrites tailored to your target role.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline text-xs font-mono uppercase tracking-wider text-brand-ink flex items-center justify-between">
                <span>Score your resume free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Dossier Card 2: 90-Day Roadmap */}
            <div
              onClick={() => handleFeatureClick("roadmap")}
              className="group cursor-pointer rounded-xl border border-hairline bg-paper p-6 sm:p-8 space-y-6 shadow-atelier hover:border-brand-ink/50 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
                    <Compass className="w-4 h-4 text-brand-ink" />
                    <span>02 · 90-Day Roadmap</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-ink-muted bg-inset px-2.5 py-0.5 rounded-md border border-hairline">
                    12 Weeks
                  </span>
                </div>

                {/* Milestone Track Artifact */}
                <div className="rounded-lg border border-hairline bg-canvas p-3.5 space-y-3">
                  <div className="flex justify-between text-[11px] font-mono text-ink-muted">
                    <span className="text-brand-ink font-semibold">01. Foundation</span>
                    <span>02. Projects</span>
                    <span>03. Placement</span>
                  </div>
                  <div className="w-full bg-inset rounded-full h-1.5 overflow-hidden border border-hairline">
                    <div className="bg-brand h-full rounded-full w-2/5" />
                  </div>
                  <div className="text-[11px] text-ink-subtle font-mono">
                    Vetted free resources only · 1–2 hrs/day
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-ink group-hover:text-brand-ink transition-colors">
                    Structured Skill Sequence
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Week-by-week 12-week syllabus paired strictly with verified free tutorials and portfolio milestones.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline text-xs font-mono uppercase tracking-wider text-brand-ink flex items-center justify-between">
                <span>Generate your roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Dossier Card 3: Skill-Based Jobs */}
            <div
              onClick={() => handleFeatureClick("jobs")}
              className="group cursor-pointer rounded-xl border border-hairline bg-paper p-6 sm:p-8 space-y-6 shadow-atelier hover:border-brand-ink/50 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
                    <Briefcase className="w-4 h-4 text-brand-ink" />
                    <span>03 · Verified Roles</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-pass bg-pass-bg px-2.5 py-0.5 rounded-md border border-pass-border">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Scam Shield</span>
                  </div>
                </div>

                {/* Role Entry Artifact */}
                <div className="rounded-lg border border-hairline bg-canvas p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-ink text-xs truncate">
                      Junior Frontend Engineer
                    </div>
                    <div className="text-[11px] font-mono text-ink-subtle truncate">
                      React · TypeScript · Remote
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-brand-ink bg-paper px-2 py-1 rounded border border-hairline shrink-0 tabular-nums">
                    95% Match
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-ink group-hover:text-brand-ink transition-colors">
                    Skill-Grounded Opportunities
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Unbiased fresher openings ranked on verified skills with automated scam and fee-request detection.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline text-xs font-mono uppercase tracking-wider text-brand-ink flex items-center justify-between">
                <span>View curated jobs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Dossier Card 4: 5-Min Mock Interview */}
            <div
              onClick={() => handleFeatureClick("mock_interview")}
              className="group cursor-pointer rounded-xl border border-hairline bg-paper p-6 sm:p-8 space-y-6 shadow-atelier hover:border-brand-ink/50 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
                    <Award className="w-4 h-4 text-brand-ink" />
                    <span>04 · Mock Interview</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-ink bg-inset px-2.5 py-0.5 rounded-md border border-hairline tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-ink-muted" />
                    <span>05:00</span>
                  </div>
                </div>

                {/* Rubric Artifact */}
                <div className="rounded-lg border border-hairline bg-canvas p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-ink text-xs truncate">
                      Fresher Technical &amp; Behavioral
                    </div>
                    <div className="text-[11px] font-mono text-ink-subtle truncate">
                      5 questions · Voice or Text · Model answers
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-ink-muted bg-paper px-2 py-1 rounded border border-hairline shrink-0">
                    4 Pillars
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-ink group-hover:text-brand-ink transition-colors">
                    Supportive Live Practice
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Timed 5-minute interview drills evaluated across clarity, accuracy, confidence, and communication.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline text-xs font-mono uppercase tracking-wider text-brand-ink flex items-center justify-between">
                <span>Start mock interview</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Promise Anchor - Rich Botanical Dark Green */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-xl bg-manifesto text-[#F4EFEA] p-8 sm:p-14 border border-manifesto-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EFEA]/70 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cta" />
              <span>03 / Our Standard</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-poster uppercase tracking-wide text-[#F4EFEA] leading-[0.95]">
              Skills Matter. <span className="text-[#F4EFEA]/80">Pedigree Doesn&apos;t.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#F4EFEA]/80 max-w-xl mx-auto leading-relaxed">
              Zero CGPA barriers, zero tier bias — just transparent rubrics and actionable career growth for every student.
            </p>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-[#F4EFEA] tabular-nums">0%</div>
                <div className="text-xs text-[#F4EFEA]/75 font-mono uppercase tracking-wider mt-1">CGPA Bias</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-[#F4EFEA] tabular-nums">100%</div>
                <div className="text-xs text-[#F4EFEA]/75 font-mono uppercase tracking-wider mt-1">Free Access</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-[#F4EFEA] tabular-nums">&lt;30s</div>
                <div className="text-xs text-[#F4EFEA]/75 font-mono uppercase tracking-wider mt-1">Audit Latency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1-on-1 Personalized Mentorship Section */}
      <section className="py-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <ContactTrainingCard />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-hairline bg-paper py-10 text-xs text-ink-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-ink">CP/</span>
            <span className="font-medium text-ink">CareerPilot</span>
            <span className="text-hairline-strong">·</span>
            <span>India DPDP Act Compliant</span>
          </div>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-wider">
            <Link href="/dashboard" className="text-ink-muted hover:text-ink transition-colors">
              Privacy &amp; Consent
            </Link>
            <Link href="/admin" className="text-ink-muted hover:text-ink transition-colors">
              Admin &amp; Telemetry
            </Link>
          </div>
        </div>
      </footer>

      {/* Bottom Floating Widget */}
      <FloatingChatWidget
        isOpen={chatWidgetOpen}
        onOpenChange={setChatWidgetOpen}
        intent={chatIntent}
      />

      {/* Registration Modal */}
      <RegistrationModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

