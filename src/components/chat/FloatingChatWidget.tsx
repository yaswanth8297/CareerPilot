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
      {!isOpen && (
        <button
          onClick={() => handleSetOpen(true)}
          className="group flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white shadow-atelier-lg border border-brand-hover active:translate-y-px transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-cta flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="text-left font-sans pr-1">
            <div className="text-xs font-semibold leading-none tracking-tight">Career Guide</div>
            <div className="text-[10px] text-white/75 font-mono mt-1">30s Resume &amp; Role Check</div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[420px] h-[590px] max-h-[85vh] bg-paper rounded-xl border border-hairline shadow-atelier-lg flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-3 bg-canvas text-ink flex items-center justify-between shrink-0 border-b border-hairline">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center font-mono font-bold text-[10px] text-white">
                CP/
              </div>
              <div>
                <h4 className="font-semibold text-xs text-ink tracking-tight">CareerPilot Studio</h4>
                <p className="text-[10px] font-mono text-ink-subtle">Personal Career Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href={activeIntent ? `/chat?intent=${encodeURIComponent(activeIntent)}` : "/chat"}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-inset transition-colors"
                title="Expand to Full Page"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleSetOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-inset transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatContainer isEmbedded={true} initialIntent={activeIntent} />
          </div>
        </div>
      )}
    </div>
  );
}
