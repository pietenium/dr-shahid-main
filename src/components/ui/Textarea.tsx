"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helperText, id, maxLength, value, ...props },
    ref,
  ) => {
    const inputId =
      id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-end">
          {label && (
            <label
              htmlFor={inputId}
              className="text-xs font-semibold uppercase tracking-wider text-text-para-light dark:text-text-para-dark"
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-[10px] text-text-para-light dark:text-text-para-dark">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          className={cn(
            "w-full rounded-lg border bg-card-light dark:bg-card-dark px-3 py-2 text-sm transition-all outline-none resize-none min-h-25",
            "border-border-light dark:border-border-dark",
            "focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-text-para-light dark:text-text-para-dark mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
