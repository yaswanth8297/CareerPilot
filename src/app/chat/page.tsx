"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import ChatContainer from "@/components/chat/ChatContainer";
import RegistrationModal from "@/components/modals/RegistrationModal";

export default function ChatPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-1 flex flex-col">
        <ChatContainer isEmbedded={false} />
      </main>

      <RegistrationModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
