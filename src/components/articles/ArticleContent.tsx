"use client";

import { cn } from "@/lib/utils";

interface ArticleContentProps {
  html: string;
  className?: string;
}

export const ArticleContent = ({ html, className }: ArticleContentProps) => {
  return (
    <div
      className={cn(
        "article-content prose prose-lg dark:prose-invert max-w-none",
        "prose-headings:text-text-heading-light dark:prose-headings:text-text-heading-dark",
        "prose-p:text-text-para-light dark:prose-p:text-text-para-dark",
        "prose-a:text-brand-primary hover:prose-a:text-brand-hover prose-a:no-underline prose-a:font-bold",
        "prose-img:rounded-2xl prose-img:shadow-xl",
        "prose-strong:text-brand-primary dark:prose-strong:text-brand-accent",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized HTML from backend
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
