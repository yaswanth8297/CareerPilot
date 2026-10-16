"use client";

import Navbar from "@/components/common/Navbar";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pb-16">
        <AdminDashboard />
      </main>
    </div>
  );
}
