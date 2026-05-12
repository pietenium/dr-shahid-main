"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center bg-card-light dark:bg-card-dark rounded-2xl border border-dashed border-border-light dark:border-border-dark",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 p-4 rounded-full bg-brand-softbg dark:bg-brand-primary/10 text-brand-primary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-text-heading-light dark:text-text-heading-dark mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-para-light dark:text-text-para-dark max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
