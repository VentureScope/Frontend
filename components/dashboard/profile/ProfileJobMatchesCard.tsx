"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { getJobProfileMatches } from "@/lib/jobs-api";
import { matchFitLabel } from "@/lib/job-market-insights";
import type { JobMatch } from "@/types/jobs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileJobMatchesCard() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getJobProfileMatches({ limit: 3 });
        if (!cancelled) {
          setMatches(data);
        }
      } catch {
        if (!cancelled) {
          setMatches([]);
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
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">Top job matches</h3>
        <Link
          href="/dashboard/market-trends"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Market trends →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Complete your profile and sync GitHub or transcript data to see
          personalized openings.
        </p>
      ) : (
        <ul className="space-y-3">
          {matches.map((job) => {
            const fit = matchFitLabel(job.distance);
            return (
              <li
                key={job.id}
                className="rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {job.job_title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {job.company_name}
                      {job.city ? ` · ${job.city}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {fit.pct}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/dashboard/market-trends"
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
      >
        <Briefcase className="h-3.5 w-3.5" />
        Explore hiring demand
      </Link>
    </div>
  );
}
