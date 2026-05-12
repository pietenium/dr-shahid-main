import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleFilter } from "@/components/articles/ArticleFilter";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { getArticles } from "@/lib/api/articles";

export const metadata: Metadata = {
  title: "Articles & Insights",
  description:
    "Explore the latest orthopedic insights, surgical techniques, and patient care tips by Dr. Sahidur Rahman Khan.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const category =
    searchParams.category === "all" ? undefined : searchParams.category;

  let data:
    | import("@/types/api").PaginatedData<import("@/types/article").Article>
    | undefined;
  try {
    data = await getArticles({ page, category, limit: 9 });
  } catch (error) {
    console.error("Failed to fetch articles", error);
  }

  // Mock categories for now
  const categories = [
    "Surgery",
    "Recovery",
    "Trauma",
    "Joint Health",
    "Sports Medicine",
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Knowledge Center"
        title="Articles & Medical Insights"
        subtitle="Staying informed is the first step towards recovery. Browse my latest publications on orthopedic health."
      />

      <Suspense fallback={<div className="mb-12 h-10" />}>
        <ArticleFilter
          categories={categories}
          activeCategory={searchParams.category || "all"}
          className="mb-12"
        />
      </Suspense>

      {!data || data.docs.length === 0 ? (
        <EmptyState
          title="No Articles Found"
          description="We couldn't find any articles matching your criteria. Please try a different category or check back later."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.docs.map((article, idx) => (
              <ArticleCard key={article._id} article={article} idx={idx} />
            ))}
          </div>

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
