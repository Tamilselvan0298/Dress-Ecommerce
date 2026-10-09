import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "charcoal" | "ivory" | "outline" | "danger";
  className?: string;
}

export function Badge({ children, variant = "ivory", className }: BadgeProps) {
  const variants = {
    gold: "bg-gold-500/15 text-gold-700 border-gold-400/40",
    charcoal: "bg-charcoal-900 text-ivory-100 border-charcoal-800",
    ivory: "bg-ivory-200 text-charcoal-700 border-border",
    outline: "bg-transparent text-charcoal-600 border-border",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] font-sans tracking-luxury uppercase border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

