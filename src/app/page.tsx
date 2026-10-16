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
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import RegistrationModal from "@/components/modals/RegistrationModal";
import ContactTrainingCard from "@/components/ContactTrainingCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
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
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Ambient radial accent glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-100/50 via-indigo-50/30 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <SectionLabel pulse={true} className="mx-auto">
            Zero-Judgment Career Co-Pilot for College Students
          </SectionLabel>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            No campus mentor? Meet your personal{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Career Guide
            </span>{" "}
            for honest career growth!
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Build your student profile in 30 seconds. Get an honest ATS score breakdown, 90-day actionable roadmap, verified job matches, and 5-min supportive mock interview practice — with zero CGPA judgment.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group shadow-sm">
                <MessageSquare className="w-5 h-5" />
                <span>Start Chatting Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Compass className="w-5 h-5 text-blue-600" />
                <span>Student Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free for Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero CGPA Judgment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Grounded Vetted Free Resources
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Scam Job Alert Heuristics
            </span>
          </div>
        </div>
      </section>

      {/* 4 Core Value Moments Grid */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Real Value First, Sign-Up Second
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-sans">
              All 4 core features include a full interactive preview in anonymous guest mode!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div
              onClick={() => handleFeatureClick("resume_check")}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">1. ATS Resume Checker</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Deterministic 100-point rubric breakdown. Exactly 3 fixable mistakes with clear Before → After bullet rewrites.
              </p>
              <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                Score + Mistake #1 Free Preview →
              </span>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => handleFeatureClick("roadmap")}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">2. 90-Day Roadmap</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                12-week structured sequence (Foundation → Build → Job Ready). Grounded strictly with vetted free guides & projects.
              </p>
              <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                First 2 Weeks Free Preview →
              </span>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => handleFeatureClick("jobs")}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">3. Skill-Based Jobs</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Unbiased ranking on skills and gap metrics. Automatic detection of suspicious upfront payment scams.
              </p>
              <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                2 to 3 Curated Matches Free →
              </span>
            </div>

            {/* Feature 4 */}
            <div
              onClick={() => handleFeatureClick("mock_interview")}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">4. 5-Min Mock Interview</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                5-minute timer, 5-6 questions tuned for freshers. Supportive scoring report across 4 pillars with model answers.
              </p>
              <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                Full Feedback Report →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Student Promise Section - Strictly Light Theme */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border border-blue-200/80 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="absolute inset-0 dot-pattern-light opacity-60 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center space-y-5">
            <SectionLabel pulse={false}>
              OUR STUDENT PROMISE
            </SectionLabel>

            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 max-w-3xl leading-snug">
              &quot;Your college tier or background doesn&apos;t limit your potential — your skills and effort define your trajectory.&quot;
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-sans">
              CareerPilot AI delivers concise, supportive guidance with interactive quick-reply chips, actionable feedback, and zero judgment.
            </p>

            <div className="pt-2">
              <Link href="/chat">
                <Button variant="primary" size="md" className="group">
                  <span>Launch Career Guide Chat</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1-on-1 Personalized Training & Guidance Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <ContactTrainingCard />
      </section>

      {/* Footer - Strictly Light Theme */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">CareerPilot AI</span>
            <span>— India DPDP Act Compliant</span>
          </div>
          <div className="flex gap-4 font-medium">
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
