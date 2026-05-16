import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-10">
      <Skeleton variant="text" className="h-10 w-48 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid
          <Skeleton key={i} variant="card" className="h-72" />
        ))}
      </div>
    </div>
  );
}
