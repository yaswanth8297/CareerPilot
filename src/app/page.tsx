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

export default function Home() {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [chatIntent, setChatIntent] = useState<string | null>(null);

  // Detect URL parameter triggers (e.g., ?openChat=true&intent=resume_check)
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
    // If mobile viewport, navigate directly to /chat route
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      router.push(`/chat?intent=${encodeURIComponent(intent)}`);
    } else {
      // On desktop / tablet, trigger floating chat widget with context
      setChatIntent(intent);
      setChatWidgetOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-orange-500 selection:text-white">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Judgment Career Co-Pilot for College Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            No campus mentor? Meet your personal{" "}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 bg-clip-text text-transparent">
              Career Guide
            </span>{" "}
            for honest career growth!
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Build your student profile in 30 seconds. Get an honest ATS score breakdown, 90-day actionable roadmap, verified job matches, and 5-min supportive mock interview practice — with zero CGPA judgment.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Start Chatting Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm sm:text-base border border-zinc-200 dark:border-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-indigo-500" />
              <span>Student Dashboard</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
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
      <section className="py-16 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              Real Value First, Sign-Up Second
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
              All 4 core features include a full interactive preview in anonymous guest mode!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div
              onClick={() => handleFeatureClick("resume_check")}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-4 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-lg hover:shadow-orange-500/10 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">1. ATS Resume Checker</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Deterministic 100-point rubric breakdown. Exactly 3 fixable mistakes with clear Before → After bullet rewrites.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick("resume_check");
                }}
                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 group-hover:underline inline-flex items-center gap-1 cursor-pointer text-left"
              >
                Score + Mistake #1 Free Preview →
              </button>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => handleFeatureClick("roadmap")}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">2. 90-Day Roadmap</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                12-week structured sequence (Foundation → Build → Job Ready). Grounded strictly with vetted free guides & projects.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick("roadmap");
                }}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline inline-flex items-center gap-1 cursor-pointer text-left"
              >
                First 2 Weeks Free Preview →
              </button>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => handleFeatureClick("jobs")}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-4 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">3. Skill-Based Jobs</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Unbiased ranking on skills and gap metrics. Automatic detection of suspicious upfront payment scams.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick("jobs");
                }}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline inline-flex items-center gap-1 cursor-pointer text-left"
              >
                2 to 3 Curated Matches Free →
              </button>
            </div>

            {/* Feature 4 */}
            <div
              onClick={() => handleFeatureClick("mock_interview")}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-6 space-y-4 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/10 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">4. 5-Min Mock Interview</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                5-minute timer, 5-6 questions tuned for freshers. Supportive scoring report across 4 pillars with model answers.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick("mock_interview");
                }}
                className="text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline inline-flex items-center gap-1 cursor-pointer text-left"
              >
                Full Feedback Report →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Promise Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 p-2 px-3 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-bold">
          <HeartHandshake className="w-4 h-4" />
          <span>Our Student Promise</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
          &quot;Your college tier or background doesn&apos;t limit your potential — your skills and effort define your trajectory.&quot;
        </h2>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          CareerPilot AI delivers concise, supportive 2-3 line guidance with interactive quick-reply chips, actionable feedback, and zero judgment.
        </p>

        <div className="pt-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all"
          >
            <span>Launch Career Guide Chat</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 1-on-1 Personalized Training & Guidance Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <ContactTrainingCard />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-900 dark:text-white">CareerPilot AI</span>
            <span>— India DPDP Act Compliant</span>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:underline">
              Privacy & Consent
            </Link>
            <Link href="/admin" className="hover:underline">
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
