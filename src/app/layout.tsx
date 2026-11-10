import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
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
  title: "CareerPilot — Personal Career Guide for College Students",
  description:
    "Personal career studio for college students. Deterministic ATS resume auditing, 90-day placement roadmaps with vetted free resources, verified job matches, and 5-minute mock interviews.",
  keywords: [
    "CareerPilot",
    "ATS Resume Checker",
    "College Career Guide",
    "Mock Interview",
    "90 Day Roadmap",
    "Fresher Jobs"
  ],
  authors: [{ name: "CareerPilot Team" }]
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('careerpilot_theme');if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${anton.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans selection:bg-brand selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
