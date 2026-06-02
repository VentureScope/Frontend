"use client";

import { useEffect, useState } from "react";
import { Building2, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber } from "@/lib/job-market-insights";
import { MARKET_PULSE_FALLBACK_STATS } from "@/lib/market-pulse-fallback";

export function AboutJobMarketStats() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const stats = MARKET_PULSE_FALLBACK_STATS;

  return (
    <div className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-5 rounded-xl sm:rounded-lg bg-card p-4 sm:p-6 shadow-xl border border-border max-w-[11rem] sm:max-w-xs">
      {!ready ? (
        <div className="space-y-2 py-1">
          <Skeleton className="h-7 w-16 bg-muted" />
          <Skeleton className="h-3 w-full bg-muted" />
          <Skeleton className="h-3 w-4/5 bg-muted" />
        </div>
      ) : (
        <>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {formatCompactNumber(stats.total_jobs)}+
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-1 leading-snug">
            Sample market scale — sign in for live stats on your dashboard.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Roles
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Employers
            </span>
          </div>
        </>
      )}
    </div>
  );
}
