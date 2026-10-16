import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "featured" | "inverted";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  if (variant === "featured") {
    return (
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-[#0052FF] via-[#4D7CFF] to-[#0052FF] p-[2px] shadow-accent transition-all duration-300 hover:shadow-accent-lg hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        <div className="h-full w-full rounded-[calc(1rem-2px)] bg-white dark:bg-[#0F172A] p-6">
          {children}
        </div>
      </div>
    );
  }

  const variantStyles = {
    default:
      "bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-200",
    elevated:
      "bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5",
    inverted:
      "bg-[#0F172A] text-white border border-slate-800 shadow-xl"
  };

  return (
    <div
      className={cn("rounded-2xl p-6 relative overflow-hidden", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-[#0F172A] dark:text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-slate-500 dark:text-slate-400 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props}>{children}</div>;
}
