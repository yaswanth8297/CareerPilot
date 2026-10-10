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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                CareerPilot
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">
              Your personal career guide
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/chat"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === "/chat"
                ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Co-Pilot Chat</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === "/dashboard"
                ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">My Space</span>
          </Link>

          <Link
            href="/admin"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              pathname === "/admin"
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
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
              className="ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="max-w-[80px] truncate">{userName || "Profile"}</span>
            </Link>
          ) : (
            <button
              onClick={onOpenAuth}
              className="ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-1.5"
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
