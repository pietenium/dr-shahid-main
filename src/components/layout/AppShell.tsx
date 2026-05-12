"use client";

import type React from "react";
import { AnalyticsTracker } from "@/components/shared/AnalyticsTracker";
import { PageTransition } from "@/components/shared/PageTransition";
import { BackToTop } from "@/components/ui/BackToTop";
import type { AppInfo } from "@/types/app-info";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
  appInfo?: AppInfo;
}

export const AppShell = ({ children, appInfo }: AppShellProps) => {
  return (
    <>
      <AnalyticsTracker />
      <Header appInfo={appInfo} />
      <AppShellContent>{children}</AppShellContent>
      <Footer appInfo={appInfo} />
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
