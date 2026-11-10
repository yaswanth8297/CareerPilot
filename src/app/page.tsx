"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
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
import { SectionLabel } from "@/components/ui/SectionLabel";

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
    <div className="min-h-screen bg-[#FAFAF8] text-[#141518] flex flex-col font-sans">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Hero Section - Editorial Precision */}
      <section className="pt-20 pb-24 sm:pt-28 sm:pb-32 border-b border-[#E7E5DE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="flex justify-center">
            <SectionLabel>01 / Career Guidance Studio</SectionLabel>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-semibold tracking-[-0.03em] text-[#141518] leading-[1.08]">
            Your personal career guide.{" "}
            <span className="font-display italic font-normal text-[#183059] block sm:inline">
              Zero judgment.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#52555E] max-w-2xl mx-auto leading-relaxed font-normal">
            Deterministic ATS resume auditing, 90-day placement roadmaps, and structured mock interview drills built for college students.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/chat">
              <Button variant="primary" size="lg" className="px-7 group">
                <MessageSquare className="w-4 h-4" />
                <span>Start Free Career Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleFeatureClick("resume_check")}
              className="px-6"
            >
              <FileText className="w-4 h-4 text-[#52555E]" />
              <span>Audit My Resume</span>
            </Button>
          </div>

          {/* Minimalist Trust Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-mono text-[#82858E]">
            <span>100% Free Forever</span>
            <span className="hidden sm:inline text-[#D3D0C7]">/</span>
            <span>Zero CGPA Bias</span>
            <span className="hidden sm:inline text-[#D3D0C7]">/</span>
            <span>No Account Required</span>
          </div>
        </div>
      </section>

      {/* Core Capabilities Dossier Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E5DE] pb-6">
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#82858E]">
                02 / Core Toolkit
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#141518]">
                Everything required to get hired.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#52555E] max-w-md">
              Purpose-built tools calibrated for Tier-2 and Tier-3 placements. Click any card to launch immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dossier Card 1: ATS Resume Checker */}
            <div
              onClick={() => handleFeatureClick("resume_check")}
              className="group cursor-pointer rounded-xl border border-[#E7E5DE] bg-white p-6 sm:p-8 space-y-6 shadow-atelier hover:border-[#183059]/40 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[#52555E]">
                    <FileText className="w-4 h-4 text-[#183059]" />
                    <span>01 · ATS Rubric</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#166534] bg-[#F0FDF4] px-2.5 py-0.5 rounded-md border border-[#BBF7D0] tabular-nums">
                    88 / 100
                  </span>
                </div>

                {/* Diff Preview Artifact */}
                <div className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-3.5 font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-[#82858E] border-b border-[#E7E5DE] pb-1.5">
                    <span>BULLET_REWRITE.DIFF</span>
                    <span className="text-[#166534] font-semibold">+14 pts</span>
                  </div>
                  <div className="text-[#991B1B] line-through opacity-75 truncate">
                    - Built a React app for college students
                  </div>
                  <div className="text-[#166534] font-medium truncate">
                    + Optimized React bundle load time by 38% via code splitting
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-[#141518] group-hover:text-[#183059] transition-colors">
                    Deterministic ATS Audit
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52555E] leading-relaxed">
                    Instant 100-point rubric score with 3 concrete before-and-after bullet rewrites tailored to your target role.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F4F3EE] text-xs font-medium text-[#183059] flex items-center justify-between">
                <span>Score your resume free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Dossier Card 2: 90-Day Roadmap */}
            <div
              onClick={() => handleFeatureClick("roadmap")}
              className="group cursor-pointer rounded-xl border border-[#E7E5DE] bg-white p-6 sm:p-8 space-y-6 shadow-atelier hover:border-[#183059]/40 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[#52555E]">
                    <Compass className="w-4 h-4 text-[#183059]" />
                    <span>02 · 90-Day Roadmap</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#52555E] bg-[#F4F3EE] px-2.5 py-0.5 rounded-md border border-[#E7E5DE]">
                    12 Weeks
                  </span>
                </div>

                {/* Milestone Track Artifact */}
                <div className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-3.5 space-y-3">
                  <div className="flex justify-between text-[11px] font-mono text-[#52555E]">
                    <span className="text-[#183059] font-semibold">01. Foundation</span>
                    <span>02. Projects</span>
                    <span>03. Placement</span>
                  </div>
                  <div className="w-full bg-[#E7E5DE] rounded-full h-1 overflow-hidden">
                    <div className="bg-[#183059] h-full rounded-full w-2/5" />
                  </div>
                  <div className="text-[11px] text-[#82858E] font-mono">
                    Vetted free resources only · 1–2 hrs/day
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-[#141518] group-hover:text-[#183059] transition-colors">
                    Structured Skill Sequence
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52555E] leading-relaxed">
                    Week-by-week 12-week syllabus paired strictly with verified free tutorials and portfolio milestones.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F4F3EE] text-xs font-medium text-[#183059] flex items-center justify-between">
                <span>Generate your roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Dossier Card 3: Skill-Based Jobs */}
            <div
              onClick={() => handleFeatureClick("jobs")}
              className="group cursor-pointer rounded-xl border border-[#E7E5DE] bg-white p-6 sm:p-8 space-y-6 shadow-atelier hover:border-[#183059]/40 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[#52555E]">
                    <Briefcase className="w-4 h-4 text-[#183059]" />
                    <span>03 · Verified Roles</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-[#166534] bg-[#F0FDF4] px-2.5 py-0.5 rounded-md border border-[#BBF7D0]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Scam Shield</span>
                  </div>
                </div>

                {/* Role Entry Artifact */}
                <div className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-[#141518] text-xs truncate">
                      Junior Frontend Engineer
                    </div>
                    <div className="text-[11px] font-mono text-[#82858E] truncate">
                      React · TypeScript · Remote
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#183059] bg-white px-2 py-1 rounded border border-[#E7E5DE] shrink-0 tabular-nums">
                    95% Match
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-[#141518] group-hover:text-[#183059] transition-colors">
                    Skill-Grounded Opportunities
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52555E] leading-relaxed">
                    Unbiased fresher openings ranked on verified skills with automated scam and fee-request detection.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F4F3EE] text-xs font-medium text-[#183059] flex items-center justify-between">
                <span>View curated jobs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Dossier Card 4: 5-Min Mock Interview */}
            <div
              onClick={() => handleFeatureClick("mock_interview")}
              className="group cursor-pointer rounded-xl border border-[#E7E5DE] bg-white p-6 sm:p-8 space-y-6 shadow-atelier hover:border-[#183059]/40 hover:shadow-atelier-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[#52555E]">
                    <Award className="w-4 h-4 text-[#183059]" />
                    <span>04 · Mock Interview</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-[#141518] bg-[#F4F3EE] px-2.5 py-0.5 rounded-md border border-[#E7E5DE] tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-[#52555E]" />
                    <span>05:00</span>
                  </div>
                </div>

                {/* Rubric Artifact */}
                <div className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-[#141518] text-xs truncate">
                      Fresher Technical &amp; Behavioral
                    </div>
                    <div className="text-[11px] font-mono text-[#82858E] truncate">
                      5 questions · Voice or Text · Model answers
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#52555E] bg-white px-2 py-1 rounded border border-[#E7E5DE] shrink-0">
                    4 Pillars
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg text-[#141518] group-hover:text-[#183059] transition-colors">
                    Supportive Live Practice
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52555E] leading-relaxed">
                    Timed 5-minute interview drills evaluated across clarity, accuracy, confidence, and communication.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F4F3EE] text-xs font-medium text-[#183059] flex items-center justify-between">
                <span>Start mock interview</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Promise Anchor - Deep Oxford Navy */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-xl bg-[#183059] text-white p-8 sm:p-14 border border-[#102344]">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
              03 / Our Standard
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-normal tracking-tight text-white leading-tight">
              Skills matter. <span className="italic text-white/85">Pedigree doesn&apos;t.</span>
            </h2>

            <p className="text-sm sm:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
              Zero CGPA barriers, zero tier bias — just transparent rubrics and actionable career growth for every student.
            </p>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-white tabular-nums">0%</div>
                <div className="text-xs text-white/70 font-mono uppercase tracking-wider mt-1">CGPA Bias</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-white tabular-nums">100%</div>
                <div className="text-xs text-white/70 font-mono uppercase tracking-wider mt-1">Free Access</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-white tabular-nums">&lt;30s</div>
                <div className="text-xs text-white/70 font-mono uppercase tracking-wider mt-1">Audit Latency</div>
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
      <footer className="mt-auto border-t border-[#E7E5DE] bg-white py-10 text-xs text-[#82858E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-[#141518]">CP/</span>
            <span className="font-medium text-[#141518]">CareerPilot</span>
            <span className="text-[#D3D0C7]">·</span>
            <span>India DPDP Act Compliant</span>
          </div>
          <div className="flex gap-6 font-medium">
            <Link href="/dashboard" className="text-[#52555E] hover:text-[#141518] transition-colors">
              Privacy &amp; Consent
            </Link>
            <Link href="/admin" className="text-[#52555E] hover:text-[#141518] transition-colors">
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
