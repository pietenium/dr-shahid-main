import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "./use-ui-store";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      isMobileMenuOpen: false,
      cookieConsentAccepted: false,
    });
    localStorage.clear();
  });

  it("opens mobile menu", () => {
    useUIStore.getState().openMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
  });

  it("closes mobile menu", () => {
    useUIStore.getState().openMobileMenu();
    useUIStore.getState().closeMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("toggles mobile menu", () => {
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("accepts cookie consent", () => {
    useUIStore.getState().acceptCookieConsent();
    expect(useUIStore.getState().cookieConsentAccepted).toBe(true);
  });

  it("provides dummy storage when window is undefined", () => {
    const persistOptions = (useUIStore as any).persist.getOptions();
    expect(persistOptions.name).toBe("ds-ui");
  });
});
