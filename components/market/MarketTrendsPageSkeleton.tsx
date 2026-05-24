import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketTrendsPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="vs-surface flex min-h-[360px] flex-col items-center justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading market trends…
            </p>
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-6 lg:col-span-4">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
