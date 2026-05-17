"use client";

import { useEffect, useState } from "react";
import { Building2, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobStats } from "@/lib/jobs-api";
import { formatCompactNumber } from "@/lib/job-market-insights";

export function AboutJobMarketStats() {
  const [stats, setStats] = useState<{
    total_jobs: number;
    unique_companies: number;
    unique_categories: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await getJobStats();
        if (!cancelled) {
          setStats(s);
        }
      } catch {
        if (!cancelled) {
          setStats(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-snug mt-1">
            roles tracked across Ethiopia&apos;s tech hiring market
          </p>
          <div className="mt-3 pt-3 border-t border-border space-y-1.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
              <Building2 className="h-3 w-3 text-primary" />
              {formatCompactNumber(stats.unique_companies)} employers
            </p>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
              <Briefcase className="h-3 w-3 text-primary" />
              {stats.unique_categories} role categories
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="text-xl sm:text-2xl font-bold text-foreground">10k+</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
            Profiles analyzed across the Ethiopian tech ecosystem.
          </p>
        </>
      )}
    </div>
  );
}
