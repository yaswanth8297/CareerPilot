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
  Sparkles,
  ArrowRight,
  CheckCircle2,
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 sm:pt-36 sm:pb-44">
        {/* Ambient radial accent glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] bg-gradient-to-tr from-blue-100/60 via-indigo-50/40 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Micro Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/70 bg-blue-50/80 text-blue-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Career Co-Pilot</span>
          </div>

          {/* Under 10-Word Value Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Your personal career co-pilot.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Zero judgment.
            </span>
          </h1>

          {/* Single-Line Subtext */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-sans leading-normal">
            Instant ATS resume review, 90-day roadmaps, and mock interview practice.
          </p>

          {/* Single Clear CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat">
              <Button
                variant="primary"
                size="lg"
                className="h-12 px-8 text-sm sm:text-base font-semibold group shadow-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all rounded-xl"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Start Free Career Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Minimalist Micro Trust Indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Free
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zero CGPA Filter
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No Account Required
            </span>
          </div>
        </div>
      </section>

      {/* Bento-Box Features Grid */}
      <section className="py-24 sm:py-36 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
              CORE FEATURES
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Everything you need to get hired.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-sans">
              Interactive tools designed to elevate your career readiness in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Bento Card 1: ATS Resume Checker */}
            <div
              onClick={() => handleFeatureClick("resume_check")}
              className="group cursor-pointer rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-5 shadow-xs hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      ATS Resume Checker
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>88 / 100</span>
                  </div>
                </div>

                {/* Visual Cue Widget */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Bullet Rewrite Preview</span>
                    <span className="text-blue-600 font-semibold">+14 pts match</span>
                  </div>
                  <p className="text-slate-800 font-medium text-xs truncate">
                    &quot;Optimized React bundle loading time by 38% via dynamic code splitting&quot;
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    Deterministic ATS Rubric
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    Get an instant rubric score with 3 concrete before-and-after bullet rewrites.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Score your resume free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bento Card 2: 90-Day Roadmap */}
            <div
              onClick={() => handleFeatureClick("roadmap")}
              className="group cursor-pointer rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-5 shadow-xs hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      90-Day Roadmap
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
                    12 Weeks
                  </span>
                </div>

                {/* Visual Cue Widget */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600">
                    <span className="text-blue-600 font-semibold">1. Foundation</span>
                    <span>2. Projects</span>
                    <span>3. Placements</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full w-2/5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    Structured Skill Sequence
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    Step-by-step 12-week roadmap paired strictly with vetted free tutorials and projects.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Generate your roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bento Card 3: Skill-Based Jobs */}
            <div
              onClick={() => handleFeatureClick("jobs")}
              className="group cursor-pointer rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-5 shadow-xs hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Verified Matches
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Scam Shield</span>
                  </div>
                </div>

                {/* Visual Cue Widget */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 text-xs">Junior Frontend Engineer</div>
                    <div className="text-[11px] text-slate-500">React · TypeScript · Tailwind</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300/60">
                    95% Match
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    Skill-Grounded Roles
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    Unbiased job opportunities matched to your strengths with upfront scam detection.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View curated jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bento Card 4: 5-Min Mock Interview */}
            <div
              onClick={() => handleFeatureClick("mock_interview")}
              className="group cursor-pointer rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-5 shadow-xs hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mock Interview
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200/60">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>05:00</span>
                  </div>
                </div>

                {/* Visual Cue Widget */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 text-xs">Freshers Tech & Behavioral</div>
                    <div className="text-[11px] text-slate-500">5 questions with instant rubric scores</div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-300/60">
                    4 Pillars
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    Live Supportive Practice
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    Fast 5-minute timed interview drills with actionable scoring and model answers.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Start mock interview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Promise Section */}
      <section className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border border-blue-200/70 p-8 sm:p-14 text-center space-y-8 shadow-xs">
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
              OUR PROMISE
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 max-w-2xl leading-snug">
              Skills matter. Pedigree doesn&apos;t.
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-sans">
              Zero CGPA barriers, zero tier bias — just honest, actionable career growth.
            </p>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg w-full">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-2xs">
                <div className="text-xl sm:text-2xl font-extrabold text-blue-600">0%</div>
                <div className="text-[11px] text-slate-500 font-medium">CGPA Bias</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-2xs">
                <div className="text-xl sm:text-2xl font-extrabold text-blue-600">100%</div>
                <div className="text-[11px] text-slate-500 font-medium">Free Access</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-2xs">
                <div className="text-xl sm:text-2xl font-extrabold text-blue-600">&lt;30s</div>
                <div className="text-[11px] text-slate-500 font-medium">Fast Answers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1-on-1 Personalized Mentorship Section */}
      <section className="pb-24 sm:pb-36 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <ContactTrainingCard />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">CareerPilot AI</span>
            <span>— India DPDP Act Compliant</span>
          </div>
          <div className="flex gap-6 font-medium">
            <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors">
              Privacy & Consent
            </Link>
            <Link href="/admin" className="text-slate-600 hover:text-blue-600 transition-colors">
              Admin & Telemetry
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
