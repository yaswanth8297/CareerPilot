"use client";

import Navbar from "@/components/common/Navbar";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors">
      <Navbar />
      <main className="flex-1 pb-16">
        <StudentDashboard />
      </main>
    </div>
  );
}
