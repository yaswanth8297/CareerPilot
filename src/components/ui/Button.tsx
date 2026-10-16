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
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-6 text-sm sm:text-base gap-2.5"
    };

    const variantStyles = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:bg-blue-800",
      secondary:
        "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200/80 hover:-translate-y-0.5",
      outline:
        "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs hover:-translate-y-0.5",
      ghost:
        "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100",
      inverted:
        "bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 font-semibold"
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
