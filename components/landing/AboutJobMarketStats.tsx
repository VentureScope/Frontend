"use client";

import { useEffect, useState } from "react";
import { Building2, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobStatsQuery } from "@/hooks/queries/use-job-stats-query";
import { formatCompactNumber } from "@/lib/job-market-insights";
import { MARKET_ALL_TIME_DAYS } from "@/lib/market-analytics-period";
import { MARKET_PULSE_FALLBACK_STATS } from "@/lib/market-pulse-fallback";
import type { JobStats } from "@/types/jobs";

export function AboutJobMarketStats() {
  const statsQuery = useJobStatsQuery(MARKET_ALL_TIME_DAYS);
  const [fixedStats, setFixedStats] = useState<JobStats | null>(null);

  useEffect(() => {
    if (statsQuery.data && fixedStats == null) {
      setFixedStats(statsQuery.data);
    }
  }, [statsQuery.data, fixedStats]);

  const stats =
    fixedStats ?? (statsQuery.isError ? MARKET_PULSE_FALLBACK_STATS : null);
  const loading = stats == null && statsQuery.isPending;

  return (
    <div className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-5 rounded-xl sm:rounded-lg bg-card p-4 sm:p-6 shadow-xl border border-border max-w-[11rem] sm:max-w-xs">
      {loading ? (
        <div className="space-y-2 py-1">
          <Skeleton className="h-7 w-16 bg-muted" />
          <Skeleton className="h-3 w-full bg-muted" />
          <Skeleton className="h-3 w-4/5 bg-muted" />
        </div>
      ) : stats ? (
        <>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {formatCompactNumber(stats.total_jobs)}+
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-1 leading-snug">
            Postings indexed across Ethiopia&apos;s tech job market.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Postings
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Employers
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}
