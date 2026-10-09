"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-sans tracking-editorial uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary: "bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 border border-charcoal-900",
      secondary: "bg-ivory-200 text-charcoal-900 hover:bg-ivory-300 border border-ivory-300",
      outline: "bg-transparent text-charcoal-900 border border-charcoal-900 hover:bg-charcoal-900 hover:text-ivory-100",
      ghost: "bg-transparent text-charcoal-800 hover:bg-ivory-200/60",
      gold: "bg-gold-500 text-charcoal-900 hover:bg-gold-600 border border-gold-500 font-medium",
    };

    const sizes = {
      sm: "text-xs px-4 py-2",
      md: "text-xs px-6 py-3.5 tracking-luxury",
      lg: "text-sm px-8 py-4 tracking-luxury",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

