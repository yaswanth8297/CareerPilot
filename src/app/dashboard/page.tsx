"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import RegistrationModal from "@/components/modals/RegistrationModal";

export default function DashboardPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col font-sans text-[#141518]">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
      <main className="flex-1 pb-16">
        <StudentDashboard />
      </main>
      <RegistrationModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
