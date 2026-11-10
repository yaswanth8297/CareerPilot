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
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-out select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#183059] focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none active:translate-y-px cursor-pointer";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-xs sm:text-sm gap-2",
      lg: "h-11 px-5 text-sm gap-2.5"
    };

    const variantStyles = {
      primary:
        "bg-[#183059] hover:bg-[#102344] text-white shadow-xs border border-[#183059]",
      secondary:
        "bg-[#F4F3EE] text-[#141518] border border-[#E7E5DE] hover:bg-[#ECEBE4]",
      outline:
        "bg-white border border-[#E7E5DE] text-[#141518] hover:bg-[#FAFAF8] hover:border-[#D3D0C7] shadow-xs",
      ghost:
        "bg-transparent text-[#52555E] hover:text-[#141518] hover:bg-[#F4F3EE]",
      inverted:
        "bg-white text-[#183059] border border-white hover:bg-[#FAFAF8] shadow-xs"
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
