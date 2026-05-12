"use client";

import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const visible = useMemo(
    () => testimonials.filter((t) => t.isVisible !== false),
    [testimonials],
  );

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, visible.length - 1));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (!child) return;
    child.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setActive(clamped);
  };

  if (!visible.length) return null;

  return (
    <section className="py-24 bg-white dark:bg-bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <SectionHeading
            badge="Patient Voices"
            title="What Patients Say"
            subtitle="Real experiences from people who trusted Dr. Khan with their recovery."
            className="mb-0"
          />
          <Button
            href="/testimonials"
            variant="outline"
            className="w-full lg:w-auto justify-center"
          >
            View All Testimonials
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => scrollToIndex(active - 1)}
            className="w-10 h-10 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:border-brand-primary/60 transition-colors"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            {visible.slice(0, 8).map((_t, idx) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: stable small list
                key={idx}
                type="button"
                aria-label={`Go to testimonial ${idx + 1}`}
                onClick={() => scrollToIndex(idx)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  idx === active
                    ? "bg-brand-primary w-6"
                    : "bg-border-light dark:bg-border-dark",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollToIndex(active + 1)}
            className="w-10 h-10 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:border-brand-primary/60 transition-colors"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        <motion.div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scroll-smooth"
          onScroll={() => {
            const el = scrollerRef.current;
            if (!el) return;
            const children = Array.from(el.children) as HTMLElement[];
            const center = el.scrollLeft + el.clientWidth / 2;
            let closest = 0;
            let best = Number.POSITIVE_INFINITY;
            for (let i = 0; i < children.length; i++) {
              const c = children[i];
              const cCenter = c.offsetLeft + c.clientWidth / 2;
              const d = Math.abs(cCenter - center);
              if (d < best) {
                best = d;
                closest = i;
              }
            }
            setActive(closest);
          }}
        >
          {visible.map((t, idx) => (
            <div
              key={t._id}
              className="snap-center shrink-0 w-[85vw] sm:w-[60vw] lg:w-[380px]"
            >
              <TestimonialCard testimonial={t} idx={idx} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
