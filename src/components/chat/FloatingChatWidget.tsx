"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, MessageSquare, ExternalLink } from "lucide-react";
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
      {/* Floating Trigger Button - Architectural Pill */}
      {!isOpen && (
        <button
          onClick={() => handleSetOpen(true)}
          className="group flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl bg-[#183059] hover:bg-[#102344] text-white shadow-atelier-lg border border-[#102344] active:translate-y-px transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>

          <div className="text-left font-sans">
            <div className="text-xs font-semibold leading-none tracking-tight">Career Guide</div>
            <div className="text-[10px] text-white/70 font-mono mt-1">30s Resume &amp; Role Check</div>
          </div>
        </button>
      )}

      {/* Expanded Floating Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[420px] h-[590px] max-h-[85vh] bg-white rounded-xl border border-[#E7E5DE] shadow-atelier-lg flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Top Bar */}
          <div className="px-4 py-3 bg-[#FAFAF8] text-[#141518] flex items-center justify-between shrink-0 border-b border-[#E7E5DE]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#183059] flex items-center justify-center font-mono font-bold text-[10px] text-white">
                CP/
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[#141518] tracking-tight">CareerPilot Studio</h4>
                <p className="text-[10px] font-mono text-[#82858E]">Personal Career Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href={activeIntent ? `/chat?intent=${encodeURIComponent(activeIntent)}` : "/chat"}
                className="p-1.5 rounded-lg text-[#52555E] hover:text-[#141518] hover:bg-[#F4F3EE] transition-colors"
                title="Expand to Full Page"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleSetOpen(false)}
                className="p-1.5 rounded-lg text-[#52555E] hover:text-[#141518] hover:bg-[#F4F3EE] transition-colors cursor-pointer"
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
