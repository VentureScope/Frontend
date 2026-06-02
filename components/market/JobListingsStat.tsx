import { TrendingDown, TrendingUp } from "lucide-react";
import {
  formatCompactNumber,
  formatJobStatsPeriodCaption,
} from "@/lib/job-market-insights";
import type { JobStats } from "@/types/jobs";
import { cn } from "@/lib/utils";

type JobListingsStatProps = {
  stats: JobStats | null;
  loading?: boolean;
  lookbackPhrase?: string;
  isAllTime?: boolean;
  className?: string;
};

export default function JobListingsStat({
  stats,
  loading,
  lookbackPhrase,
  isAllTime = false,
  className,
}: JobListingsStatProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "vs-surface-accent flex min-h-[180px] animate-pulse flex-col justify-between p-6 sm:p-8",
          className,
        )}
      >
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-12 w-32 rounded bg-muted" />
      </div>
    );
  }

  const total = stats?.total_jobs ?? 0;
  const companies = stats?.unique_companies ?? 0;
  const categories = stats?.unique_categories ?? 0;
  const periodCaption = formatJobStatsPeriodCaption(
    stats,
    lookbackPhrase,
    isAllTime,
  );

  return (
    <div
      className={cn(
        "vs-surface-accent flex h-full min-h-[180px] flex-col justify-between p-6 transition-colors sm:p-8",
        className,
      )}
    >
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {isAllTime ? "Total jobs in database" : "Indexed job listings"}
        </p>
        <h2 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
          {formatCompactNumber(total)}
        </h2>
        <p className="text-xs text-muted-foreground">{periodCaption}</p>
      </div>

      <div className="mt-6 flex w-fit items-center gap-2 rounded-full border border-success/20 bg-success/15 px-3 py-2 text-[10px] font-bold text-success sm:mt-8 sm:px-4 sm:text-[11px]">
        {total > 0 ? (
          <>
            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
            <span>
              {formatCompactNumber(companies)} employers · {categories} role
              categories
            </span>
          </>
        ) : (
          <>
            <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
            <span>No jobs in this period</span>
          </>
        )}
      </div>
    </div>
  );
}
