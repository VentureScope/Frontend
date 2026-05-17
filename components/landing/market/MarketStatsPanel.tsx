"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, Layers, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketStatsSkeleton } from "@/components/landing/market/MarketPulseSkeletons";
import { Button } from "@/components/ui/button";
import type { JobStats } from "@/types/jobs";
import {
  formatCompactNumber,
  marketCoverageIndex,
  statsInsight,
} from "@/lib/job-market-insights";

export function MarketStatsPanel({
  stats,
  loading,
  showCta = true,
  variant = "hero",
}: {
  stats: JobStats | null;
  loading: boolean;
  showCta?: boolean;
  variant?: "hero" | "inline";
}) {
  const coverage = stats ? marketCoverageIndex(stats) : null;
  const insight = stats ? statsInsight(stats) : null;

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
    <div className="vs-surface relative flex h-full min-h-[280px] flex-col justify-between p-6 sm:p-8 lg:p-10">
      <div className="space-y-3">
        <p className="text-label text-muted-foreground">Market overview</p>
        <h3 className="text-lg font-semibold text-foreground sm:text-xl">
          Market at a glance
        </h3>
        {insight && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {insight}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <MiniStat label="Roles" value={stats?.total_jobs} />
        <MiniStat label="Employers" value={stats?.unique_companies} />
        <MiniStat label="Categories" value={stats?.unique_categories} />
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
          <Link href="/register">Build your career profile</Link>
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
}: {
  label: string;
  value: number | undefined;
}) {
  return (
    <div>
      <p className="text-label text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-semibold text-foreground sm:text-2xl">
        {value != null ? formatCompactNumber(value) : "—"}
      </p>
    </div>
  );
}
