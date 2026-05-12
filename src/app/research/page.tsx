import type { Metadata } from "next";
import { ResearchCard } from "@/components/research/ResearchCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { getResearchList } from "@/lib/api/research";

export const metadata: Metadata = {
  title: "Research & Publications",
  description:
    "Browse the clinical research, medical papers, and innovations in orthopedic surgery by Dr. Sahidur Rahman Khan.",
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;

  let data:
    | import("@/types/api").PaginatedData<import("@/types/research").Research>
    | undefined;
  try {
    data = await getResearchList({ page, limit: 12 });
  } catch (error) {
    console.error("Failed to fetch research", error);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Academic Excellence"
        title="Research & Publications"
        subtitle="Contributing to the advancement of orthopedic science through evidence-based research and clinical studies."
      />

      {!data || data.docs.length === 0 ? (
        <EmptyState
          title="No Research Found"
          description="We haven't published any research papers in this category yet. Please check back later."
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
