"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="max-w-2xl w-full text-center space-y-10"
      >
        <div className="space-y-4">
          <div className="text-6xl md:text-7xl font-black bg-linear-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-heading-light dark:text-text-heading-dark">
            Page Not Found
          </h1>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" size="lg" className="w-full sm:w-auto">
            Go Home
          </Button>
          <Link
            href="/contact"
            className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:text-brand-hover transition-colors"
          >
            Contact the clinic
          </Link>
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute inset-0 -z-10"
      >
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-brand-primary/10 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-16 right-10 w-56 h-56 rounded-full bg-brand-secondary/10 blur-2xl"
        />
      </motion.div>
    </div>
  );
}
