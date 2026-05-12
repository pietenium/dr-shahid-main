"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ArticleFilterProps {
  categories: string[];
  activeCategory: string;
  className?: string;
}

export const ArticleFilter = ({
  categories,
  activeCategory,
  className,
}: ArticleFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <button
        onClick={() => setCategory("all")}
        className={cn(
          "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
          activeCategory === "all"
            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
            : "bg-card-light dark:bg-card-dark text-text-para-light dark:text-text-para-dark hover:bg-gray-100 dark:hover:bg-gray-800",
        )}
        type="button"
      >
        All Articles
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setCategory(category)}
          className={cn(
            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
            activeCategory === category
              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
              : "bg-card-light dark:bg-card-dark text-text-para-light dark:text-text-para-dark hover:bg-gray-100 dark:hover:bg-gray-800",
          )}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  );
};
