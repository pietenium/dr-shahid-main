"use client";

import type React from "react";
import { AnalyticsTracker } from "@/components/shared/AnalyticsTracker";
import { PageTransition } from "@/components/shared/PageTransition";
import { BackToTop } from "@/components/ui/BackToTop";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <>
      <AnalyticsTracker />
      <Header />
      <AppShellContent>{children}</AppShellContent>
      <Footer />
      <BackToTop />
    </>
  );
};

// Internal wrapper to separate layout from page transitions
const AppShellContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 pt-24 pb-20">
      <PageTransition>{children}</PageTransition>
    </main>
  );
};
