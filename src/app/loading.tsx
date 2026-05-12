import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-6 py-24 space-y-8">
      <Skeleton variant="text" className="h-10 w-1/3" />
      <Skeleton variant="paragraph" className="h-24 w-full" />
      <Skeleton variant="paragraph" className="h-24 w-full" />
    </div>
  );
}
