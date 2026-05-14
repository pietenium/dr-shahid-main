import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search articles, research, and testimonials.",
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-6 py-12 max-w-3xl space-y-6">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-12 w-full" />
          <div className="flex gap-2 justify-center">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
