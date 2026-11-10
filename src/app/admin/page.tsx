"use client";

import Navbar from "@/components/common/Navbar";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans text-ink paper-grain">
      <Navbar />
      <main className="flex-1 pb-16">
        <AdminDashboard />
      </main>
    </div>
  );
}
