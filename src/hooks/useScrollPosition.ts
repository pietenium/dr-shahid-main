import { useEffect, useState } from "react";

/**
 * Hook to track if the scroll position is past a certain threshold.
 * Uses requestAnimationFrame for performance and passive listener.
 */
export function useScrollPosition(threshold = 0): boolean {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsPast(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial state
    setIsPast(window.scrollY > threshold);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isPast;
}
