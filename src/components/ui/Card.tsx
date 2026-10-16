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
          "rounded-2xl border-2 border-blue-500/80 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-600 hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  const variantStyles = {
    default:
      "bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200",
    elevated:
      "bg-white border border-slate-200/90 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5",
    inverted:
      "bg-slate-50 text-slate-900 border border-slate-200 shadow-sm"
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
      className={cn("text-lg font-semibold tracking-tight text-slate-900", className)}
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
      className={cn("text-xs text-slate-500 leading-relaxed font-sans", className)}
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
