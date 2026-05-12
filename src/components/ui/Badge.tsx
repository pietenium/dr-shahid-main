"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "info"
    | "medical"
    | "political";
  className?: string;
  showDot?: boolean;
}

export const Badge = ({
  children,
  variant = "default",
  className,
  showDot = false,
}: BadgeProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    medical:
      "bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-accent",
    political:
      "bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20 dark:text-blue-300",
  };

  const dots = {
    default: "bg-gray-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    medical: "bg-brand-primary",
    political: "bg-brand-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase",
        variants[variant],
        className,
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dots[variant])} />
      )}
      {children}
    </span>
  );
};
