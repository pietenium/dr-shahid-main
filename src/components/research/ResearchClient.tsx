"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ResearchCard } from "@/components/research/ResearchCard";
import { ResearchFilters } from "@/components/research/ResearchFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchResearchClient } from "@/lib/api/research";
import type { PaginatedData } from "@/types/api";
import type { Research, UploadType } from "@/types/research";

export function ResearchClient({
  initialResearch,
}: {
  initialResearch?: PaginatedData<Research>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || "1") || 1;
  const uploadType = (searchParams.get("uploadType") || "") as UploadType | "";
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);
  const debouncedSearch = useDebounce(searchInput.trim(), 300);

  const queryKey = useMemo(
    () => ["research", { page, uploadType, search: debouncedSearch }],
    [page, uploadType, debouncedSearch],
  );

  const { data, isFetching, isError } = useQuery({
    queryKey,
    queryFn: async () =>
      fetchResearchClient({
        page,
        limit: 12,
        uploadType: uploadType || undefined,
        search: debouncedSearch || undefined,
      }),
    initialData:
      !uploadType && !search && page === 1 ? initialResearch : undefined,
    staleTime: 5 * 60 * 1000,
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

  return (
    <div className="space-y-10">
      <ResearchFilters
        uploadType={uploadType}
        search={searchInput}
        onSearchChange={(v) => {
          setSearchInput(v);
          setParams({ search: v.trim() ? v : undefined, page: undefined });
        }}
        onUploadTypeChange={(v) =>
          setParams({ uploadType: v || undefined, page: undefined })
        }
        onClearAll={() =>
          setParams({
            uploadType: undefined,
            search: undefined,
            page: undefined,
          })
        }
      />

      {isError ? (
        <EmptyState
          title="Something went wrong"
          description="Failed to load research items. Please try again."
        />
      ) : isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid
            <Skeleton key={i} variant="card" className="h-72" />
          ))}
        </div>
      ) : !data || data.docs.length === 0 ? (
        <EmptyState
          title="No Research Found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.docs.map((research, idx) => (
              <ResearchCard key={research._id} research={research} idx={idx} />
            ))}
          </div>

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            basePath="/research"
          />
        </>
      )}
    </div>
  );
}
