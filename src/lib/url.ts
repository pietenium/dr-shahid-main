import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Hook to update URL search parameters without full page reloads.
 */
export function useSetParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };
}
