import type { Metadata } from "next";
import { Inter, Calistoga, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const calistoga = Calistoga({
  variable: "--font-calistoga",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${inter.variable} ${calistoga.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] font-sans selection:bg-[#0052FF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
