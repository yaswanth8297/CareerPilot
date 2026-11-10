import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pulse?: boolean;
}

export function SectionLabel({
  children,
  pulse: _pulse,
  className,
  ...props
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-[#E7E5DE] bg-[#F4F3EE] px-2.5 py-1 text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-[#52555E]",
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-sm bg-[#183059]" />
      <span>{children}</span>
    </div>
  );
}
