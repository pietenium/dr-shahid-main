"use client";

import type React from "react";
import { AnalyticsTracker } from "@/components/shared/AnalyticsTracker";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { PageTransition } from "@/components/shared/PageTransition";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-100 focus:p-4 focus:bg-brand-primary focus:text-white"
      >
        Skip to main content
      </a>
      <AnalyticsTracker />
      <Header appInfo={appInfo} />
      <AppShellContent>{children}</AppShellContent>
      <Footer appInfo={appInfo} />
      <BackToTop />
      <CookieConsent />
      <WhatsAppButton phone={appInfo?.phone} />
    </>
  );
};

// Internal wrapper to separate layout from page transitions
const AppShellContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 pt-24 focus:outline-none"
    >
      <PageTransition>{children}</PageTransition>
    </main>
  );
};
