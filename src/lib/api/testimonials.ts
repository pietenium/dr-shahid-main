import { serverFetch } from "@/lib/fetcher";
import type { PaginatedData } from "@/types/api";
import type { Testimonial } from "@/types/testimonial";

export async function getTestimonials(): Promise<PaginatedData<Testimonial>> {
  const data = await serverFetch<Testimonial[] | PaginatedData<Testimonial>>(
    "/testimonials",
    {
      revalidate: 600,
      tags: ["testimonials"],
    },
  );

  if (Array.isArray(data)) {
    return {
      docs: data,
      totalDocs: data.length,
      limit: data.length,
      totalPages: 1,
      page: 1,
    };
  }

  return data;
}
