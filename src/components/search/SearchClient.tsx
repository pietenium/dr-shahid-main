"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { searchContent } from "@/lib/api/search";
import { useSearchStore } from "@/store/use-search-store";
import type { SearchType } from "@/types/search";

const TYPE_TABS: Array<{ label: string; value: SearchType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Research", value: "research" },
  { label: "Testimonials", value: "testimonial" },
];

export function SearchClient() {
  const [query, setQuery] = useState("");
  const {
    activeType: type,
    setActiveType: setType,
    addRecentSearch,
    recentSearches,
    clearRecentSearches,
  } = useSearchStore();
  const [focused, setFocused] = useState(false);
  const debounced = useDebounce(query.trim(), 400);

  const queryKey = useMemo(
    () => ["search", { q: debounced, type }],
    [debounced, type],
  );

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey,
    enabled: debounced.length >= 2,
    queryFn: async () =>
      searchContent({
        q: debounced,
        type: type === "all" ? undefined : type,
        limit: 10,
      }),
  });

  useEffect(() => {
    if (debounced.length >= 2 && data) {
      addRecentSearch(debounced, type);
    }
  }, [debounced, data, type, addRecentSearch]);

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Find Content"
        title="Search"
        subtitle="Search across articles, research publications, and patient testimonials."
      />

      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <Input
          label="Search"
          placeholder="Type at least 2 characters…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus
        />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {TYPE_TABS.map((t) => {
            const active = t.value === type;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={[
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                  active
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-para-light dark:text-text-para-dark hover:border-brand-primary/60",
                ].join(" ")}
                aria-pressed={active}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {debounced.length < 2 ? (
          focused && query.trim().length === 0 && recentSearches.length ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark">
                    Recent searches
                  </h3>
                  <p className="text-xs text-text-para-light dark:text-text-para-dark opacity-70">
                    Tap a previous search to try again.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs font-semibold text-brand-primary hover:text-brand-hover"
                >
                  Clear
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {recentSearches.map((item) => (
                  <button
                    key={`${item.query}-${item.type}-${item.timestamp}`}
                    type="button"
                    onClick={() => {
                      setType(item.type);
                      setQuery(item.query);
                    }}
                    className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 py-3 text-left text-sm text-text-heading-light dark:text-text-heading-dark hover:border-brand-primary transition"
                  >
                    <span className="font-semibold">{item.query}</span>
                    <div className="text-[11px] text-text-para-light dark:text-text-para-dark opacity-80">
                      {item.type === "all"
                        ? "All"
                        : item.type === "article"
                          ? "Articles"
                          : item.type === "research"
                            ? "Research"
                            : "Testimonials"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Start typing to search"
              description="Try searching for a condition, procedure, or publication title."
            />
          )
        ) : isFetching ? (
          <div className="space-y-4">
            <Skeleton variant="text" className="h-5 w-40" />
            <Skeleton variant="paragraph" className="h-24 w-full" />
            <Skeleton variant="paragraph" className="h-24 w-full" />
          </div>
        ) : isError ? (
          <EmptyState
            title="Search failed"
            description="Please try again."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="px-6 py-3 rounded-lg bg-brand-primary text-white font-bold"
              >
                Retry
              </button>
            }
          />
        ) : data ? (
          <SearchResults query={debounced} activeType={type} data={data} />
        ) : (
          <EmptyState
            title="No results"
            description={`No results found for "${debounced}".`}
          />
        )}
      </div>
    </div>
  );
}
