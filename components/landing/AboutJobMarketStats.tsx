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
    <div className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-5 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-xl border border-slate-100 max-w-[11rem] sm:max-w-xs">
      {loading ? (
        <div className="space-y-2 py-1">
          <Skeleton className="h-7 w-16 bg-slate-100" />
          <Skeleton className="h-3 w-full bg-slate-100" />
          <Skeleton className="h-3 w-4/5 bg-slate-100" />
        </div>
      ) : stats ? (
        <>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">
            {formatCompactNumber(stats.total_jobs)}+
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 leading-snug mt-1">
            roles tracked across Ethiopia&apos;s tech hiring market
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
              <Building2 className="h-3 w-3 text-blue-600" />
              {formatCompactNumber(stats.unique_companies)} employers
            </p>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
              <Briefcase className="h-3 w-3 text-blue-600" />
              {stats.unique_categories} role categories
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">10k+</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 leading-tight">
            Profiles analyzed across the Ethiopian tech ecosystem.
          </p>
        </>
      )}
    </div>
  );
}
