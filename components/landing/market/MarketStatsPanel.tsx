"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, Layers, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketStatsSkeleton } from "@/components/landing/market/MarketPulseSkeletons";
import { Button } from "@/components/ui/button";
import { useLandingAuth } from "@/hooks/useLandingAuth";
import type { JobStats } from "@/types/jobs";
import {
  formatCompactNumber,
  marketCoverageIndex,
  statsInsight,
} from "@/lib/job-market-insights";

export function MarketStatsPanel({
  stats,
  allTimeStats,
  loading,
  showCta = true,
  variant = "hero",
}: {
  stats: JobStats | null;
  allTimeStats?: JobStats | null;
  loading: boolean;
  showCta?: boolean;
  variant?: "hero" | "inline";
}) {
  const { isAuthenticated, dashboardHref, registerHref } = useLandingAuth();
  const coverage = stats ? marketCoverageIndex(stats) : null;
  const insight = stats ? statsInsight(stats) : null;

  // Use all-time totals for the overview numbers when available,
  // fall back to the filtered stats so the card always shows something.
  const overviewStats = allTimeStats ?? stats;

  if (variant === "inline") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={<Briefcase className="h-5 w-5" />}
          label="Open roles"
          value={stats?.total_jobs}
          loading={loading}
        />
        <StatTile
          icon={<Building2 className="h-5 w-5" />}
          label="Hiring companies"
          value={stats?.unique_companies}
          loading={loading}
        />
        <StatTile
          icon={<Layers className="h-5 w-5" />}
          label="Role categories"
          value={stats?.unique_categories}
          loading={loading}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="vs-surface relative min-h-[280px] h-full overflow-hidden p-6 sm:p-8 lg:p-10">
        <MarketStatsSkeleton />
      </div>
    );
  }

  return (
    <div className="vs-surface relative flex min-h-[240px] flex-col justify-between p-5 sm:p-6 lg:min-h-[280px] lg:p-8">
      <div className="min-w-0 space-y-2">
        <p className="text-label text-primary">Market overview</p>
        <h3 className="text-lg font-semibold text-foreground sm:text-xl">
          Market at a glance
        </h3>
        {insight && (
          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {insight}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 min-[400px]:grid-cols-3">
        <MiniStat
          label="Roles indexed"
          value={overviewStats?.total_jobs}
          subValue={
            allTimeStats && stats && allTimeStats.total_jobs > stats.total_jobs
              ? stats.total_jobs
              : undefined
          }
          subLabel="in period"
        />
        <MiniStat label="Employers" value={overviewStats?.unique_companies} />
        <MiniStat label="Categories" value={overviewStats?.unique_categories} />
      </div>

      {coverage != null && (
        <p className="mt-4 text-xs text-muted-foreground">
          Coverage index:{" "}
          <span className="font-semibold text-foreground">{coverage}%</span>
        </p>
      )}

      {showCta && (
        <Button
          asChild
          variant="outline"
          className="relative mt-6 w-full rounded-md border-border py-5 font-medium"
        >
          <Link href={isAuthenticated ? dashboardHref : registerHref}>
            {isAuthenticated ? "Open your dashboard" : "Build your career profile"}
          </Link>
        </Button>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  loading,
}: {
  icon: ReactNode;
  label: string;
  value: number | undefined;
  loading: boolean;
}) {
  return (
    <div className="vs-surface p-5">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
      </div>
      <p className="text-label text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-20 bg-muted" />
      ) : (
        <p className="mt-1 text-2xl font-semibold text-foreground">
          {value != null ? formatCompactNumber(value) : "—"}
        </p>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  subValue,
  subLabel,
}: {
  label: string;
  value: number | undefined;
  subValue?: number;
  subLabel?: string;
}) {
  return (
    <div>
      <p className="text-label text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-semibold text-foreground sm:text-2xl">
        {value != null ? formatCompactNumber(value) : "—"}
      </p>
      {subValue != null && subLabel && (
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground/70">
            {formatCompactNumber(subValue)}
          </span>{" "}
          {subLabel}
        </p>
      )}
    </div>
  );
}
