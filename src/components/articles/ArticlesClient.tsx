"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleFilters } from "@/components/articles/ArticleFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchArticlesClient } from "@/lib/api/articles";
import { cn } from "@/lib/utils";
import type { PaginatedData } from "@/types/api";
import type { Article, ArticleCategory, ArticleType } from "@/types/article";

export function ArticlesClient({
  initialArticles,
  categories,
}: {
  initialArticles?: PaginatedData<Article>;
  categories: ArticleCategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || "1") || 1;
  const category = searchParams.get("category") || "";
  const articleType = (searchParams.get("articleType") || "") as
    | ArticleType
    | "";
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);

  const debouncedSearch = useDebounce(searchInput.trim(), 300);

  const queryKey = useMemo(
    () => [
      "articles",
      { page, category, articleType, search: debouncedSearch },
    ],
    [page, category, articleType, debouncedSearch],
  );

  const { data, isFetching, isError } = useQuery({
    queryKey,
    queryFn: async () =>
      fetchArticlesClient({
        page,
        limit: 12,
        category: category || undefined,
        articleType: articleType || undefined,
        search: debouncedSearch || undefined,
      }),
    initialData:
      !category && !articleType && !search && page === 1
        ? initialArticles
        : undefined,
    staleTime: 60 * 1000,
  });

  const setParams = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const activePills = [
    category ? { key: "category", label: `Category: ${category}` } : null,
    articleType ? { key: "articleType", label: `Type: ${articleType}` } : null,
    debouncedSearch
      ? { key: "search", label: `Search: ${debouncedSearch}` }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  return (
    <div className="space-y-10">
      <ArticleFilters
        categories={categories}
        category={category}
        articleType={articleType}
        search={searchInput}
        onSearchChange={(v) => {
          setSearchInput(v);
          setParams({ search: v.trim() ? v : undefined, page: undefined });
        }}
        onCategoryChange={(v) =>
          setParams({ category: v || undefined, page: undefined })
        }
        onArticleTypeChange={(v) =>
          setParams({ articleType: v || undefined, page: undefined })
        }
        onClearAll={() =>
          setParams({
            category: undefined,
            articleType: undefined,
            search: undefined,
            page: undefined,
          })
        }
      />

      {activePills.length ? (
        <div className="flex flex-wrap items-center gap-2">
          {activePills.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setParams({ [p.key]: undefined, page: undefined })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark hover:border-brand-primary/50 transition-colors"
              aria-label={`Clear ${p.key} filter`}
            >
              {p.label}
              <span className="text-brand-primary">×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              setParams({
                category: undefined,
                articleType: undefined,
                search: undefined,
                page: undefined,
              })
            }
            className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-brand-hover transition-colors ml-2"
          >
            Clear all
          </button>
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          title="Something went wrong"
          description="Failed to load articles. Please try again."
        />
      ) : isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid
            <Skeleton key={i} variant="card" className="h-80" />
          ))}
        </div>
      ) : !data || data.docs.length === 0 ? (
        <EmptyState
          title="No Articles Found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
            )}
          >
            {data.docs.map((article, idx) => (
              <ArticleCard key={article._id} article={article} idx={idx} />
            ))}
          </motion.div>

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            basePath="/articles"
          />
        </>
      )}
    </div>
  );
}
