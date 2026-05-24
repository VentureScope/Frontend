import { TrendingDown, TrendingUp } from "lucide-react";
import { formatCompactNumber } from "@/lib/job-market-insights";
import type { JobStats } from "@/types/jobs";

export default function JobListingsStat({
  stats,
  loading,
}: {
  stats: JobStats | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="vs-surface-accent flex min-h-[180px] animate-pulse flex-col justify-between p-6 sm:p-10">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-12 w-32 rounded bg-muted" />
      </div>
    );
  }

  const total = stats?.total_jobs ?? 0;
  const categories = stats?.unique_categories ?? 0;

  return (
    <div className="vs-surface-accent flex flex-col justify-between p-6 transition-colors sm:p-10">
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Indexed job listings
        </p>
        <h2 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
          {formatCompactNumber(total)}
        </h2>
      </div>

      <div className="mt-6 flex w-fit items-center gap-2 rounded-full border border-success/20 bg-success/15 px-3 py-2 text-[10px] font-bold text-success sm:mt-8 sm:px-4 sm:text-[11px]">
        {categories > 0 ? (
          <>
            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
            <span>{categories} role categories tracked</span>
          </>
        ) : (
          <>
            <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
            <span>Market data syncing</span>
          </>
        )}
      </div>
    </div>
  );
}
