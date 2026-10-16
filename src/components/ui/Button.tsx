import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "inverted";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base gap-2.5"
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-sm hover:shadow-accent hover:-translate-y-0.5 hover:brightness-105",
      secondary:
        "bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:-translate-y-0.5",
      outline:
        "bg-transparent border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-slate-200 hover:border-[#0052FF]/40 hover:bg-[#0052FF]/5 hover:-translate-y-0.5",
      ghost:
        "bg-transparent text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60",
      inverted:
        "bg-white text-[#0F172A] shadow-md hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 font-semibold"
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
