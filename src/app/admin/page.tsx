"use client";

import Navbar from "@/components/common/Navbar";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors">
      <Navbar />
      <main className="flex-1 pb-16">
        <AdminDashboard />
      </main>
    </div>
  );
}
