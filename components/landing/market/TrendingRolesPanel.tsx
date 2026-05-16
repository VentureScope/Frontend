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
          : "rounded-2xl sm:rounded-3xl bg-blue-50/50 p-6 sm:p-8 lg:p-10 border border-blue-100"
      }
    >
      <div>
        <h2
          className={
            compact
              ? "text-base font-bold text-slate-900"
              : "text-lg sm:text-xl font-bold text-slate-900"
          }
        >
          {title}
        </h2>
        {!compact && (
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Top {limit} roles by hiring volume in the last 30 days.
          </p>
        )}
        {insight && !loading && (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed border-l-2 border-blue-500 pl-3">
            {insight}
          </p>
        )}
      </div>

      <div className="space-y-3 mt-4 flex-1">
        {loading ? (
          <TrendingRolesSkeleton rows={limit} />
        ) : topCareers.length === 0 ? (
          <p className="text-sm text-slate-500">No trending roles yet.</p>
        ) : (
          topCareers.map((role, i) => {
            const colors = [
              "bg-blue-600 text-white",
              "bg-violet-600 text-white",
              "bg-emerald-600 text-white",
            ];
            const growth = formatGrowthLabel(role.growth_pct);
            const volume = Math.round((role.job_count / maxJobs) * 100);

            return (
              <div
                key={`${role.name}-${i}`}
                className={
                  compact
                    ? "flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
                    : "flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 gap-3"
                }
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${colors[i % colors.length]}`}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {role.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatCompactNumber(role.job_count)} open roles ·{" "}
                      {formatCompactNumber(role.company_count)} hiring
                    </p>
                  </div>
                </div>

                {showGrowth && (
                  <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        growth.tone === "up"
                          ? "bg-emerald-50 text-emerald-700"
                          : growth.tone === "down"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {growth.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${volume}%` }}
                        />
                      </div>
                      <span className="font-bold text-blue-600 text-[10px] w-7 text-right">
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
