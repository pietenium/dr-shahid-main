"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";

const SPECIALTIES = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Specialty Icon</title>
        <path d="M10 21v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8" />
        <path d="M17 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
        <path d="M2 14h20" />
        <path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8" />
      </svg>
    ),
    title: "Joint Replacement",
    description:
      "Specialized knee and hip replacement surgeries using minimally invasive techniques for faster recovery.",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Specialty Icon</title>
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
    title: "Trauma Surgery",
    description:
      "Expert management of complex fractures and musculoskeletal injuries with advanced reconstructive techniques.",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Specialty Icon</title>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Sports Medicine",
    description:
      "Treatment of athletic injuries, including ACL reconstruction and arthroscopic procedures to get you back in the game.",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Specialty Icon</title>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Research & Innovation",
    description:
      "Actively contributing to the orthopedic community through clinical research and innovative surgical practices.",
  },
];

export const Specialties = () => {
  return (
    <AnimatedSection className="py-24 bg-white dark:bg-bg-dark">
      <div className="container mx-auto px-6">
        <SectionHeading
          badge="Specializations"
          title="Focused on Your Physical Freedom"
          subtitle="Comprehensive orthopedic solutions tailored to your unique recovery path."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SPECIALTIES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-brand-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/5"
            >
              <div className="w-14 h-14 bg-brand-softbg dark:bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark mb-4">
                {item.title}
              </h3>
              <p className="text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};
