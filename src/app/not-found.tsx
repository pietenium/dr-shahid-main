"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";

const SkeletonViewer = dynamic(
  () =>
    import("@/components/main/SkeletonViewer/SkeletonViewer").then(
      (mod) => mod.SkeletonViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <Skeleton variant="image" className="h-64 w-full rounded-2xl" />
    ),
  },
);

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-center px-6 py-20 relative overflow-hidden gap-12 container mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full space-y-10 z-10"
      >
        <div className="space-y-4">
          <div className="text-7xl md:text-8xl font-black text-brand-primary">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-heading-light dark:text-text-heading-dark">
            This page has been relocated
          </h1>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            The page you’re looking for doesn’t exist or may have been moved.
            Try searching for it or return to the homepage.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            placeholder="Search articles, research, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-col sm:flex-row items-center gap-4">
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/2 max-w-lg aspect-square lg:aspect-4/5 rounded-4xl overflow-hidden bg-bg-light dark:bg-bg-dark shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(47,160,132,0.15)] relative z-10"
      >
        <SkeletonViewer showDebug={false} />
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
