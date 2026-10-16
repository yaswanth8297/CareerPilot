"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, ExternalLink } from "lucide-react";
import ChatContainer from "./ChatContainer";

export interface FloatingChatWidgetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  intent?: string | null;
}

export default function FloatingChatWidget({
  isOpen: controlledIsOpen,
  onOpenChange,
  intent: controlledIntent
}: FloatingChatWidgetProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalIntent, setInternalIntent] = useState<string | null>(null);

  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const activeIntent = controlledIntent !== undefined ? controlledIntent : internalIntent;

  const handleSetOpen = (openState: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(openState);
    }
    onOpenChange?.(openState);
  };

  useEffect(() => {
    const handleCustomOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ intent?: string }>;
      handleSetOpen(true);
      if (customEvent.detail?.intent) {
        setInternalIntent(customEvent.detail.intent);
      }
    };
    window.addEventListener("careerpilot:open-chat", handleCustomOpen);
    return () => window.removeEventListener("careerpilot:open-chat", handleCustomOpen);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => handleSetOpen(true)}
          className="group relative flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-white absolute -top-0.5 -right-0.5 animate-ping opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-white absolute -top-0.5 -right-0.5" />
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="text-left font-sans">
            <div className="text-xs font-semibold leading-none">Personal Career Guide</div>
            <div className="text-[10px] text-white/80 font-mono mt-0.5">CareerPilot AI • 30s Check</div>
          </div>
        </button>
      )}

      {/* Expanded Floating Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[420px] h-[590px] max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Top Bar - Clean Light Theme */}
          <div className="p-3.5 bg-white text-slate-900 flex items-center justify-between shrink-0 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                CP
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">CareerPilot AI</h4>
                <p className="text-[10px] text-slate-500">Personal Career Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href={activeIntent ? `/chat?intent=${encodeURIComponent(activeIntent)}` : "/chat"}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Expand to Full Page"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleSetOpen(false)}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded Chat */}
          <div className="flex-1 overflow-hidden">
            <ChatContainer isEmbedded={true} initialIntent={activeIntent} />
          </div>
        </div>
      )}
    </div>
  );
}
