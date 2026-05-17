"use client";

import type { TrendingCareer } from "@/types/jobs";
import {
  MARKET_TOP_K,
  formatCompactNumber,
  formatGrowthLabel,
  trendingInsight,
} from "@/lib/job-market-insights";
import { TrendingRolesSkeleton } from "@/components/landing/market/MarketPulseSkeletons";

export function TrendingRolesPanel({
  careers,
  loading,
  limit = MARKET_TOP_K.trending,
  compact = false,
  showGrowth = true,
  showInsight = true,
  title = "Trending careers",
}: {
  careers: TrendingCareer[];
  loading: boolean;
  limit?: number;
  compact?: boolean;
  showGrowth?: boolean;
  showInsight?: boolean;
  title?: string;
}) {
  const topCareers = careers.slice(0, limit);
  const insight = showInsight ? trendingInsight(topCareers) : null;
  const maxJobs = Math.max(...topCareers.map((c) => c.job_count), 1);

  return (
    <div
      className={
        compact
          ? "space-y-4 h-full flex flex-col"
          : "rounded-lg sm:rounded-xl bg-muted p-6 sm:p-8 lg:p-10 border border-border"
      }
    >
      <div>
        <h2
          className={
            compact
              ? "text-base font-bold text-foreground"
              : "text-lg sm:text-xl font-bold text-foreground"
          }
        >
          {title}
        </h2>
        {!compact && (
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Top {limit} roles by hiring volume in the last 30 days.
          </p>
        )}
        {insight && !loading && (
          <p className="mt-3 border-l border-border pl-3 text-sm leading-relaxed text-muted-foreground">
            {insight}
          </p>
        )}
      </div>

      <div className="space-y-3 mt-4 flex-1">
        {loading ? (
          <TrendingRolesSkeleton rows={limit} />
        ) : topCareers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trending roles yet.</p>
        ) : (
          topCareers.map((role, i) => {
            const rankStyles = [
              "bg-primary/15 text-primary border-primary/25",
              "bg-accent/15 text-accent border-accent/25",
              "bg-secondary/15 text-secondary border-secondary/25",
            ];
            const rankClass = `flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${rankStyles[i % rankStyles.length]}`;
            const growth = formatGrowthLabel(role.growth_pct);
            const volume = Math.round((role.job_count / maxJobs) * 100);

            return (
              <div
                key={`${role.name}-${i}`}
                className={
                  compact
                    ? "flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
                    : "flex flex-col sm:flex-row sm:items-center justify-between bg-card p-4 sm:p-5 rounded-lg shadow-sm border border-border gap-3"
                }
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={rankClass}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {role.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatCompactNumber(role.job_count)} open roles ·{" "}
                      {formatCompactNumber(role.company_count)} hiring
                    </p>
                  </div>
                </div>

                {showGrowth && (
                  <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0">
                    <span
                      className={`vs-badge ${
                        growth.tone === "up"
                          ? "vs-badge-success"
                          : growth.tone === "down"
                            ? "vs-badge-danger"
                            : "vs-badge-neutral"
                      }`}
                    >
                      {growth.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full bg-primary/70"
                          style={{ width: `${volume}%` }}
                        />
                      </div>
                      <span className="w-7 text-right text-[10px] font-semibold text-primary">
                        {volume}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
