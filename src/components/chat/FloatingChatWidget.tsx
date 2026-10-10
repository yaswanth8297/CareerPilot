"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import ChatContainer from "./ChatContainer";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 text-white shadow-2xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-ping" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -top-1 -right-1" />
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <div className="text-left">
            <div className="text-xs font-bold leading-none">Personal Career Guide</div>
            <div className="text-[10px] text-orange-100 font-medium mt-0.5">CareerPilot AI • 30s Check</div>
          </div>
        </button>
      )}

      {/* Expanded Floating Drawer / Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[580px] max-h-[85vh] bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Top Bar */}
          <div className="p-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                CP
              </div>
              <div>
                <h4 className="font-bold text-xs">CareerPilot AI</h4>
                <p className="text-[10px] text-orange-100">Personal Career Guide</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Embedded Chat */}
          <div className="flex-1 overflow-hidden">
            <ChatContainer isEmbedded={true} />
          </div>
        </div>
      )}
    </div>
  );
}
