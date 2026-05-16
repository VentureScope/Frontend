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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="rounded-2xl sm:rounded-3xl bg-[#1d59db] p-6 sm:p-8 lg:p-10 relative overflow-hidden min-h-[280px] h-full">
        <MarketStatsSkeleton />
      </div>
    );
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-[#1d59db] p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[280px] h-full">
      <div className="relative z-10 space-y-3">
        <h3 className="text-lg sm:text-xl font-bold">Market at a glance</h3>
        {insight && (
          <p className="text-sm text-blue-100 leading-relaxed line-clamp-3">
            {insight}
          </p>
        )}
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-3 gap-4">
        <MiniStat label="Roles" value={stats?.total_jobs} />
        <MiniStat label="Employers" value={stats?.unique_companies} />
        <MiniStat label="Categories" value={stats?.unique_categories} />
      </div>

      {coverage != null && (
        <p className="relative z-10 mt-4 text-xs text-blue-200">
          Coverage index:{" "}
          <span className="font-bold text-white">{coverage}%</span>
        </p>
      )}

      {showCta && (
        <Button
          asChild
          className="w-full bg-white text-blue-700 font-bold hover:bg-blue-50 mt-6 py-5 rounded-xl relative z-10"
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
    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-blue-600 mb-2">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      {loading ? (
        <Skeleton className="h-8 w-20 mt-2 bg-slate-100" />
      ) : (
        <p className="text-2xl font-bold text-slate-900 mt-1">
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
      <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-bold mt-0.5">
        {value != null ? formatCompactNumber(value) : "—"}
      </p>
    </div>
  );
}
