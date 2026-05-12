"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

// Dynamically import the 3D Skeleton Viewer to avoid SSR issues
const SkeletonViewer = dynamic(
  () => import("@/components/main/SkeletonViewer/SkeletonViewer"),
  {
    ssr: false,
    loading: () => <Skeleton variant="image" className="h-[500px] w-full" />,
  },
);

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-softbg dark:bg-brand-primary/5 -z-10 rounded-l-[100px] hidden lg:block" />
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-widest uppercase"
            >
              Excellence in Orthopedics
            </motion.span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
              Precision Care for Your <br />
              <span className="text-brand-primary">Mobility & Strength</span>
            </h1>
            <p className="text-lg text-text-para-light dark:text-text-para-dark max-w-xl leading-relaxed">
              Dr. Sahidur Rahman Khan combines advanced surgical techniques with
              compassionate care to help you return to the activities you love.
              Specializing in joint replacement, sports medicine, and complex
              trauma.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg"
              href="/appointment"
            >
              Book Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg"
              href="/articles"
            >
              Explore Articles
            </Button>
          </div>

          {/* Stats/Trust Badges */}
          <div className="flex items-center gap-8 pt-4 border-t border-border-light dark:border-border-dark w-fit">
            <div>
              <span className="block text-2xl font-bold text-brand-primary">
                15+
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                Years Experience
              </span>
            </div>
            <div className="w-px h-8 bg-border-light dark:bg-border-dark" />
            <div>
              <span className="block text-2xl font-bold text-brand-primary">
                5k+
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                Successful Surgeries
              </span>
            </div>
          </div>
        </motion.div>

        {/* 3D Visual Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[400px] lg:h-[600px] w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent rounded-3xl blur-2xl opacity-20" />
          <div className="relative h-full w-full rounded-3xl overflow-hidden border border-border-light dark:border-border-dark bg-white/50 dark:bg-bg-dark/50 backdrop-blur-sm shadow-2xl">
            <SkeletonViewer showDebug={false} />

            {/* Interactive Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] font-bold pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-bounce"
              >
                <title>Arrow Icon</title>
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Rotate & Explore
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-bounce"
              >
                <title>Arrow Icon</title>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
