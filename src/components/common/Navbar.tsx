"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowRight, UserCheck } from "lucide-react";
import { getInitialState } from "@/lib/storage/mockDb";
import ThemeToggle from "./ThemeToggle";

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-canvas/92 border-b border-hairline transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Top-Left: Prominent Light / Dark Switch + Brand Mark */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          <div className="h-4 w-px bg-hairline hidden sm:block" />

          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-md bg-brand flex items-center justify-center text-white font-mono text-[11px] font-bold tracking-tighter group-hover:bg-brand-hover transition-colors">
              CP
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-ink hidden md:inline">
              CareerPilot
            </span>
          </Link>
        </div>

        {/* Center Editorial Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-7 font-mono text-[11px] uppercase tracking-[0.14em]">
          <Link
            href="/chat"
            className={`py-1 transition-colors ${
              pathname === "/chat"
                ? "text-brand-ink font-semibold border-b-2 border-cta"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Co-Pilot
          </Link>

          <Link
            href="/dashboard"
            className={`py-1 transition-colors ${
              pathname === "/dashboard"
                ? "text-brand-ink font-semibold border-b-2 border-cta"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            My Space
          </Link>

          <Link
            href="/admin"
            className={`py-1 transition-colors hidden sm:inline-block ${
              pathname === "/admin"
                ? "text-brand-ink font-semibold border-b-2 border-cta"
                : "text-ink-subtle hover:text-ink"
            }`}
          >
            Admin
          </Link>
        </nav>

        {/* Right Action Pill (Editorial Pill with Circular Coral Arrow) */}
        <div className="flex items-center">
          {isRegistered ? (
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-pass-bg text-pass border border-pass-border flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="max-w-[90px] truncate">{userName || "Profile"}</span>
            </Link>
          ) : (
            <button
              onClick={onOpenAuth}
              className="group pl-3.5 pr-1.5 py-1 rounded-full border border-ink/40 hover:border-ink bg-paper text-ink font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] font-medium transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span>Save Progress</span>
              <span className="w-6 h-6 rounded-full bg-cta group-hover:bg-cta-hover text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
