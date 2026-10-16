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
        "inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1 shadow-xs transition-all",
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75 animate-ping" />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 font-sans">
        {children}
      </span>
    </div>
  );
}
