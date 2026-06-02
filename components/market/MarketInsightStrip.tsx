import type { MarketInsightCard } from "@/lib/job-market-insights";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketInsightStrip({
  insights,
  loading,
}: {
  insights: MarketInsightCard[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="vs-surface space-y-2 rounded-xl p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {insights.map((insight) => (
        <div key={insight.id} className="vs-surface rounded-xl p-4 sm:p-5">
          <p className="text-label text-primary">{insight.title}</p>
          <p className="mt-1 truncate text-lg font-bold text-foreground" title={insight.value}>
            {insight.value}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {insight.description}
          </p>
        </div>
      ))}
    </div>
  );
}
