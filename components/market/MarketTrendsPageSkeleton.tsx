import { Skeleton } from "@/components/ui/skeleton";

export function MarketTrendsPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </header>

      <div className="space-y-4">
        <div className="flex gap-4 border-b border-border pb-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-[420px] w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
