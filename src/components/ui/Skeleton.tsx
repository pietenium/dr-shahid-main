"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "image" | "avatar" | "paragraph";
}

export const Skeleton = ({ className, variant = "text" }: SkeletonProps) => {
  const variants = {
    text: "h-4 w-full rounded",
    card: "h-48 w-full rounded-xl",
    image: "h-64 w-full rounded-xl",
    avatar: "h-12 w-12 rounded-full",
    paragraph: "h-20 w-full rounded",
  };

  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700 animate-shimmer relative overflow-hidden",
        variants[variant],
        className,
      )}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/30 to-transparent animate-shimmer-fast" />
    </div>
  );
};
