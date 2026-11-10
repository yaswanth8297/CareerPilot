import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cta" | "secondary" | "outline" | "ghost" | "inverted";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 ease-out select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-40 disabled:pointer-events-none active:translate-y-px cursor-pointer";

    const sizeStyles = {
      sm: "h-8 px-3.5 text-xs gap-1.5",
      md: "h-10 px-5 text-xs sm:text-sm gap-2",
      lg: "h-11 px-6 text-xs sm:text-sm gap-2.5"
    };

    const variantStyles = {
      primary:
        "bg-brand hover:bg-brand-hover text-white shadow-xs border border-brand",
      cta:
        "bg-cta hover:bg-cta-hover text-white shadow-xs border border-cta font-mono uppercase tracking-[0.12em]",
      secondary:
        "bg-inset text-ink border border-hairline hover:bg-inset-hover",
      outline:
        "bg-paper border border-hairline-strong text-ink hover:bg-inset shadow-xs",
      ghost:
        "bg-transparent text-ink-muted hover:text-ink hover:bg-inset",
      inverted:
        "bg-paper text-brand-ink border border-hairline hover:bg-inset shadow-xs"
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

