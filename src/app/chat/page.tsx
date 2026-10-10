"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import ChatContainer from "@/components/chat/ChatContainer";
import RegistrationModal from "@/components/modals/RegistrationModal";
import { LanguagePref } from "@/lib/types";
import { getStoredLanguage, setStoredLanguage } from "@/lib/storage/mockDb";

export default function ChatPage() {
  const [language, setLanguage] = useState<LanguagePref>("hinglish");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored) setLanguage(stored);

    const handleLangChange = (e: any) => {
      if (e.detail && (e.detail === "hinglish" || e.detail === "en")) {
        setLanguage(e.detail);
      }
    };
    window.addEventListener("careerpilot_language_changed", handleLangChange);
    return () => window.removeEventListener("careerpilot_language_changed", handleLangChange);
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === "hinglish" ? "en" : "hinglish";
    setLanguage(nextLang);
    setStoredLanguage(nextLang);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors">
      <Navbar
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        <ChatContainer isEmbedded={false} language={language} />
      </main>

      <RegistrationModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
