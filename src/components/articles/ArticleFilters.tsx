"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ArticleCategory, ArticleType } from "@/types/article";

const TYPE_TABS: Array<{ label: string; value: ArticleType | "" }> = [
  { label: "All", value: "" },
  { label: "Medical", value: "MEDICAL" },
  { label: "Political", value: "POLITICAL" },
];

export function ArticleFilters({
  categories,
  category,
  articleType,
  search,
  onSearchChange,
  onCategoryChange,
  onArticleTypeChange,
  onClearAll,
}: {
  categories: ArticleCategory[];
  category: string;
  articleType: ArticleType | "";
  search: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onArticleTypeChange: (v: ArticleType | "") => void;
  onClearAll: () => void;
}) {
  const activeIdx = TYPE_TABS.findIndex((t) => t.value === articleType);
  const tabIdx = activeIdx === -1 ? 0 : activeIdx;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
        <Input
          label="Search"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select
          label="Category"
          options={[
            { value: "", label: "All categories" },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onClearAll}
          className="h-11 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark hover:border-brand-primary/60 transition-colors"
          aria-label="Clear all filters"
        >
          Clear all filters
        </button>
      </div>

      <div className="relative inline-flex rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-1">
        <motion.div
          layoutId="articleTypeTab"
          className="absolute top-1 bottom-1 rounded-full bg-brand-primary"
          style={{
            left: `calc(${tabIdx} * 33.333% + 0.25rem)`,
            width: "calc(33.333% - 0.5rem)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 35 }}
        />
        {TYPE_TABS.map((t) => {
          const active = t.value === articleType;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => onArticleTypeChange(t.value)}
              className={[
                "relative z-10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors",
                active
                  ? "text-white"
                  : "text-text-para-light dark:text-text-para-dark",
              ].join(" ")}
              aria-pressed={active}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
