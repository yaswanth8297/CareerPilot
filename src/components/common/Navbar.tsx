"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Compass, ShieldCheck, UserCheck, LogIn } from "lucide-react";
import { getInitialState } from "@/lib/storage/mockDb";

export default function Navbar({
  onOpenAuth
}: {
  onOpenAuth?: () => void;
}) {
  const pathname = usePathname();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const st = getInitialState();
    setIsRegistered(st.isRegistered);
    if (st.user?.name) setUserName(st.user.name);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAFAFA]/90 dark:bg-[#090D16]/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center text-white shadow-sm shadow-[#0052FF]/20 group-hover:scale-105 group-hover:shadow-accent transition-all duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#0F172A] dark:text-white">
                CareerPilot
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#0052FF]/10 text-[#0052FF] dark:text-[#4D7CFF] border border-[#0052FF]/20 uppercase tracking-[0.12em]">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              Minimalist career guidance
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/chat"
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              pathname === "/chat"
                ? "bg-[#0052FF]/10 text-[#0052FF] dark:text-[#4D7CFF] font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Co-Pilot Chat</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              pathname === "/dashboard"
                ? "bg-[#0052FF]/10 text-[#0052FF] dark:text-[#4D7CFF] font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">My Space</span>
          </Link>

          <Link
            href="/admin"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              pathname === "/admin"
                ? "bg-slate-200 dark:bg-slate-800 text-[#0F172A] dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Admin & Funnel Metrics"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {/* Auth Button */}
          {isRegistered ? (
            <Link
              href="/dashboard"
              className="ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 hover:bg-emerald-500/15 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="max-w-[80px] truncate">{userName || "Profile"}</span>
            </Link>
          ) : (
            <button
              onClick={onOpenAuth}
              className="ml-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-sm hover:shadow-accent hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Save Progress</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
