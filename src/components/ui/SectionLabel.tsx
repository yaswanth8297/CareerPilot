import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pulse?: boolean;
}

export function SectionLabel({
  children,
  pulse = true,
  className,
  ...props
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-[#0052FF]/25 bg-[#0052FF]/5 dark:bg-[#0052FF]/10 px-3.5 py-1.5 shadow-sm transition-all",
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#0052FF] opacity-75 animate-ping" />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0052FF]" />
      </span>
      <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#0052FF] dark:text-[#4D7CFF]">
        {children}
      </span>
    </div>
  );
}
