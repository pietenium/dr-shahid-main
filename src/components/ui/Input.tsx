"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, id, ...props },
    ref,
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-text-para-light dark:text-text-para-dark"
          >
            {label}
          </label>
        )}
        <div className="relative group focus-within:-translate-y-px transition-transform duration-200">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-para-light dark:text-text-para-dark group-focus-within:text-brand-primary transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border bg-card-light dark:bg-card-dark px-3 py-2 text-sm transition-all outline-none",
              "border-border-light dark:border-border-dark",
              "focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-para-light dark:text-text-para-dark group-focus-within:text-brand-primary transition-colors">
              {rightIcon}
            </div>
          )}
        </div>
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

Input.displayName = "Input";
