"use client";

import { motion } from "framer-motion";
import { StarRating } from "@/components/ui/StarRating";
import type { Testimonial } from "@/types/testimonial";

interface TestimonialCardProps {
  testimonial: Testimonial;
  idx?: number;
}

export const TestimonialCard = ({
  testimonial,
  idx = 0,
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-8 shadow-xl relative"
    >
      {/* Quote Icon */}
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <title>Quote Icon</title>
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H4.017V21H6.017Z" />
        </svg>
      </div>

      <div className="space-y-6">
        <StarRating rating={testimonial.rating} size="sm" />

        <p className="text-lg italic text-text-para-light dark:text-text-para-dark leading-relaxed">
          "{testimonial.content}"
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-border-light dark:border-border-dark">
          <div className="w-12 h-12 rounded-full bg-brand-softbg dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
            {testimonial.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-text-heading-light dark:text-text-heading-dark">
              {testimonial.name}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-brand-primary font-bold">
              {testimonial.designation || "Verified Patient"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
