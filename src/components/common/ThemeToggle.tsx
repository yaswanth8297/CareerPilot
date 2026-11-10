"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("careerpilot-theme-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("careerpilot-theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

let transitionTimer: ReturnType<typeof setTimeout> | null = null;

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  const setTheme = (next: "light" | "dark") => {
    if (next === theme) return;

    const root = document.documentElement;
    root.classList.add("theme-transition");
    if (transitionTimer) clearTimeout(transitionTimer);

    if (next === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem("careerpilot_theme", next);
    } catch {}

    window.dispatchEvent(new Event("careerpilot-theme-change"));

    transitionTimer = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 360);
  };

  return (
    <div
      role="group"
      aria-label="Theme Switcher"
      className="relative grid grid-cols-2 items-center p-0.5 rounded-full border border-hairline-strong bg-inset shadow-xs shrink-0 select-none"
    >
      {/* Smooth sliding pill thumb */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-brand shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? "translate-x-full" : "translate-x-0"
        }`}
      />

      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={!isDark}
        title="Light Theme (Soft Ivory)"
        className={`relative z-10 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
          !isDark ? "text-white font-semibold" : "text-ink-muted hover:text-ink"
        }`}
      >
        <Sun className={`w-3 h-3 transition-transform duration-300 ${!isDark ? "rotate-0 scale-100" : "-rotate-45 scale-90"}`} />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={isDark}
        title="Dark Theme (Forest Pine)"
        className={`relative z-10 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
          isDark ? "text-white font-semibold" : "text-ink-muted hover:text-ink"
        }`}
      >
        <Moon className={`w-3 h-3 transition-transform duration-300 ${isDark ? "rotate-0 scale-100" : "rotate-45 scale-90"}`} />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
