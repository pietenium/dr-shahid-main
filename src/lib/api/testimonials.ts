import { serverFetch } from "@/lib/fetcher";
import type { PaginatedData } from "@/types/api";
import type { Testimonial } from "@/types/testimonial";

export async function getTestimonials(): Promise<PaginatedData<Testimonial>> {
  return serverFetch<PaginatedData<Testimonial>>("/testimonials", {
    revalidate: 600,
    tags: ["testimonials"],
  });
}
