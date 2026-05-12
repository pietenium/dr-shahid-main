"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import type { UploadType } from "@/types/research";

const TYPE_TABS: Array<{ label: string; value: UploadType | "" }> = [
  { label: "All", value: "" },
  { label: "PDF", value: "PDF" },
  { label: "DOI", value: "DOI" },
];

export function ResearchFilters({
  uploadType,
  search,
  onSearchChange,
  onUploadTypeChange,
  onClearAll,
}: {
  uploadType: UploadType | "";
  search: string;
  onSearchChange: (v: string) => void;
  onUploadTypeChange: (v: UploadType | "") => void;
  onClearAll: () => void;
}) {
  const activeIdx = TYPE_TABS.findIndex((t) => t.value === uploadType);
  const tabIdx = activeIdx === -1 ? 0 : activeIdx;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
        <Input
          label="Search"
          placeholder="Search publications…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="lg:col-span-2 flex items-end gap-4 flex-wrap">
          <div className="relative inline-flex rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-1">
            <motion.div
              layoutId="researchTypeTab"
              className="absolute top-1 bottom-1 rounded-full bg-brand-primary"
              style={{
                left: `calc(${tabIdx} * 33.333% + 0.25rem)`,
                width: "calc(33.333% - 0.5rem)",
              }}
              transition={{ type: "spring", stiffness: 420, damping: 35 }}
            />
            {TYPE_TABS.map((t) => {
              const active = t.value === uploadType;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => onUploadTypeChange(t.value)}
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

          <button
            type="button"
            onClick={onClearAll}
            className="h-11 px-6 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark hover:border-brand-primary/60 transition-colors"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}
