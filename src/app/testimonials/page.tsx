import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTestimonials } from "@/lib/api/testimonials";

export const metadata: Metadata = {
  title: "Patient Stories",
  description:
    "Read what patients have to say about their recovery journey and orthopedic care with Dr. Sahidur Rahman Khan.",
};

export default async function TestimonialsPage() {
  let data:
    | import("@/types/api").PaginatedData<
        import("@/types/testimonial").Testimonial
      >
    | undefined;
  try {
    data = await getTestimonials();
  } catch (error) {
    console.error("Failed to fetch testimonials", error);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Wall of Gratitude"
        title="Patient Success Stories"
        subtitle="The greatest reward in medicine is seeing my patients return to their active lives. Here are some of their stories."
      />

      {!data || data.docs.length === 0 ? (
        <EmptyState
          title="No Testimonials Yet"
          description="We haven't added any patient stories yet. If you've been a patient of Dr. Sahidur, we'd love to hear from you!"
        />
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [column-fill:balance]">
          {data.docs.map((testimonial, idx) => (
            <div key={testimonial._id} className="mb-8 break-inside-avoid">
              <TestimonialCard testimonial={testimonial} idx={idx} />
            </div>
          ))}
        </div>
      )}

      {/* Submission Hint */}
      <div className="mt-24 max-w-2xl mx-auto text-center p-12 rounded-3xl bg-brand-softbg dark:bg-brand-primary/10 border border-dashed border-brand-primary/30">
        <h3 className="text-2xl font-bold text-text-heading-light dark:text-text-heading-dark mb-4">
          Share Your Story
        </h3>
        <p className="text-text-para-light dark:text-text-para-dark mb-8">
          Have you recently undergone treatment or surgery with Dr. Sahidur?
          Your feedback helps others on their journey to recovery.
        </p>
        <a
          href="mailto:testimonials@drshahidur.com"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-brand-hover transition-all"
        >
          Email Your Feedback
        </a>
      </div>
    </div>
  );
}
