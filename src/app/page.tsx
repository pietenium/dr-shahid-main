import React from "react";
import { Hero } from "@/components/home/Hero";
import { Specialties } from "@/components/home/Specialties";
import { About } from "@/components/home/About";
import { TestimonialsCTA } from "@/components/home/TestimonialsCTA";
import { PageTransition } from "@/components/shared/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <div className="flex flex-col w-full overflow-x-hidden">
        <Hero />
        <Specialties />
        <About />
        <TestimonialsCTA />
      </div>
    </PageTransition>
  );
}
