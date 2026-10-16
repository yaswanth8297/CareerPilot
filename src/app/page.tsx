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
  HeartHandshake
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import RegistrationModal from "@/components/modals/RegistrationModal";
import ContactTrainingCard from "@/components/ContactTrainingCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors selection:bg-[#0052FF] selection:text-white">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Ambient radial accent glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#0052FF]/15 via-[#4D7CFF]/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <SectionLabel pulse={true} className="mx-auto">
            Zero-Judgment Career Co-Pilot for College Students
          </SectionLabel>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-normal tracking-tight text-[#0F172A] dark:text-white max-w-4xl mx-auto leading-[1.12]">
            No campus mentor? Meet your personal{" "}
            <span className="gradient-text">Career Guide</span> for honest career growth!
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Build your student profile in 30 seconds. Get an honest ATS score breakdown, 90-day actionable roadmap, verified job matches, and 5-min supportive mock interview practice — with zero CGPA judgment.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group shadow-accent">
                <MessageSquare className="w-5 h-5" />
                <span>Start Chatting Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Compass className="w-5 h-5 text-[#0052FF]" />
                <span>Student Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free for Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero CGPA Judgment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grounded Vetted Free Resources
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Scam Job Alert Heuristics
            </span>
          </div>
        </div>
      </section>

      {/* 4 Core Value Moments Grid */}
      <section className="py-20 bg-white dark:bg-[#0F172A] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-display font-normal text-[#0F172A] dark:text-white">
              Real Value First, Sign-Up Second
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-sans">
              All 4 core features include a full interactive preview in anonymous guest mode!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div
              onClick={() => handleFeatureClick("resume_check")}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 space-y-4 hover:border-[#0052FF]/50 hover:shadow-accent transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base text-[#0F172A] dark:text-white">1. ATS Resume Checker</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Deterministic 100-point rubric breakdown. Exactly 3 fixable mistakes with clear Before → After bullet rewrites.
              </p>
              <span className="text-[11px] font-semibold text-[#0052FF] dark:text-[#4D7CFF] group-hover:underline inline-flex items-center gap-1 cursor-pointer">
                Score + Mistake #1 Free Preview →
              </span>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => handleFeatureClick("roadmap")}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 space-y-4 hover:border-[#0052FF]/50 hover:shadow-accent transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base text-[#0F172A] dark:text-white">2. 90-Day Roadmap</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                12-week structured sequence (Foundation → Build → Job Ready). Grounded strictly with vetted free guides & projects.
              </p>
              <span className="text-[11px] font-semibold text-[#0052FF] dark:text-[#4D7CFF] group-hover:underline inline-flex items-center gap-1 cursor-pointer">
                First 2 Weeks Free Preview →
              </span>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => handleFeatureClick("jobs")}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 space-y-4 hover:border-[#0052FF]/50 hover:shadow-accent transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base text-[#0F172A] dark:text-white">3. Skill-Based Jobs</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Unbiased ranking on skills and gap metrics. Automatic detection of suspicious upfront payment scams.
              </p>
              <span className="text-[11px] font-semibold text-[#0052FF] dark:text-[#4D7CFF] group-hover:underline inline-flex items-center gap-1 cursor-pointer">
                2 to 3 Curated Matches Free →
              </span>
            </div>

            {/* Feature 4 */}
            <div
              onClick={() => handleFeatureClick("mock_interview")}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 space-y-4 hover:border-[#0052FF]/50 hover:shadow-accent transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base text-[#0F172A] dark:text-white">4. 5-Min Mock Interview</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                5-minute timer, 5-6 questions tuned for freshers. Supportive scoring report across 4 pillars with model answers.
              </p>
              <span className="text-[11px] font-semibold text-[#0052FF] dark:text-[#4D7CFF] group-hover:underline inline-flex items-center gap-1 cursor-pointer">
                Full Feedback Report →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Student Promise Inverted Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white p-8 sm:p-12 text-center space-y-6 border border-slate-800 shadow-xl">
          <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center space-y-5">
            <SectionLabel pulse={false} className="border-white/20 bg-white/10 text-white">
              OUR STUDENT PROMISE
            </SectionLabel>

            <h2 className="text-2xl sm:text-4xl font-display font-normal text-white max-w-3xl leading-snug">
              &quot;Your college tier or background doesn&apos;t limit your potential — your skills and effort define your trajectory.&quot;
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">
              CareerPilot AI delivers concise, supportive guidance with interactive quick-reply chips, actionable feedback, and zero judgment.
            </p>

            <div className="pt-2">
              <Link href="/chat">
                <Button variant="primary" size="md" className="group shadow-accent">
                  <span>Launch Career Guide Chat</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1-on-1 Personalized Training & Guidance Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <ContactTrainingCard />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0F172A] dark:text-white">CareerPilot AI</span>
            <span>— India DPDP Act Compliant</span>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-[#0052FF] transition-colors">
              Privacy & Consent
            </Link>
            <Link href="/admin" className="hover:text-[#0052FF] transition-colors">
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
