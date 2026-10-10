import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerPilot AI — Personal Career Guide for College Students",
  description:
    "AI personal career guide for college students. 30-second profile, deterministic ATS resume scoring with 3 fixable mistakes, 90-day roadmap with vetted free resources, verified job matches, and 5-min mock interview practice.",
  keywords: [
    "CareerPilot AI",
    "ATS Resume Checker",
    "College Career Guide",
    "Mock Interview",
    "90 Day Roadmap",
    "Fresher Jobs"
  ],
  authors: [{ name: "CareerPilot AI Team" }]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
