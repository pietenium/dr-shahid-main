"use client";

import { useEffect, useState } from "react";
import { giveConsent } from "@/lib/api/visitors";
import { useUIStore } from "@/store/use-ui-store";

export const CookieConsent = () => {
  const [mounted, setMounted] = useState(false);
  const { cookieConsentAccepted, acceptCookieConsent } = useUIStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const hasAccepted =
      cookieConsentAccepted || localStorage.getItem("cookie_consent");
    setVisible(!hasAccepted);
  }, [cookieConsentAccepted, mounted]);

  const accept = async () => {
    localStorage.setItem("cookie_consent", "true");
    acceptCookieConsent();
    await giveConsent().catch(() => {
      // Ignore any network failure for consent acknowledgements.
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md p-6 rounded-3xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl">
      <div className="space-y-4">
        <p className="text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
          We use analytics cookies to understand how visitors interact with the
          website and improve the experience.
        </p>
        <button
          type="button"
          onClick={accept}
          className="w-full h-12 rounded-xl bg-brand-primary text-white text-sm font-semibold"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
};
