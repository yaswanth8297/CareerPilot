"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MessageSquare, Compass, ShieldCheck, UserCheck, ArrowUpRight } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAFAF8]/90 border-b border-[#E7E5DE] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Architectural Monogram */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#183059] flex items-center justify-center text-white font-mono text-xs font-bold tracking-tighter group-hover:bg-[#102344] transition-colors">
            CP/
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-base tracking-[-0.02em] text-[#141518]">
              CareerPilot
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-[#82858E] tracking-widest uppercase">
              Studio
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/chat"
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === "/chat"
                ? "bg-[#F4F3EE] text-[#141518] font-semibold border border-[#E7E5DE]"
                : "text-[#52555E] hover:text-[#141518] hover:bg-[#F4F3EE]/60"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Co-Pilot</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === "/dashboard"
                ? "bg-[#F4F3EE] text-[#141518] font-semibold border border-[#E7E5DE]"
                : "text-[#52555E] hover:text-[#141518] hover:bg-[#F4F3EE]/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">My Space</span>
          </Link>

          <Link
            href="/admin"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              pathname === "/admin"
                ? "bg-[#F4F3EE] text-[#141518] font-semibold border border-[#E7E5DE]"
                : "text-[#82858E] hover:text-[#141518]"
            }`}
            title="Admin & Telemetry"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          <div className="h-4 w-px bg-[#E7E5DE] mx-1 hidden sm:block" />

          {/* Auth Button */}
          {isRegistered ? (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] flex items-center gap-1.5 hover:bg-[#DCFCE7] transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="max-w-[90px] truncate">{userName || "Profile"}</span>
            </Link>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#183059] hover:bg-[#102344] text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Save Progress</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
