"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type {
  ForecastAggregationMeta,
  FutureRoleForecastBar,
} from "@/lib/job-market-insights";
import { cn } from "@/lib/utils";

const RoleDemandForecastChartView = dynamic(
  () => import("@/components/market/RoleDemandForecastChartView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
      </div>
    ),
  },
);

export function RoleDemandForecastChart({
  bars,
  selectedId,
  onSelect,
  meta,
  className,
  title = "Projected role demand",
  description = "All forecasted roles ranked by average predicted monthly postings. Click a bar to select a role.",
  showMonthlyBreakdown = true,
}: {
  bars: FutureRoleForecastBar[];
  selectedId: string;
  onSelect: (id: string) => void;
  meta?: ForecastAggregationMeta | null;
  className?: string;
  title?: string;
  description?: string;
  showMonthlyBreakdown?: boolean;
}) {
  const selected = bars.find((bar) => bar.id === selectedId);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 sm:p-6",
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        {selected ? (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Selected: </span>
            <span className="font-semibold text-foreground">
              #{selected.rank} {selected.name}
            </span>
            <span className="mt-0.5 block font-mono text-primary sm:ml-2 sm:mt-0 sm:inline">
              {selected.projectedPosts.toFixed(1)} avg posts/mo
            </span>
          </div>
        ) : null}
      </div>

      <p className="mb-3 text-xs text-muted-foreground sm:hidden">
        Tap a bar to select · role names shown in tooltip
      </p>

      <div className="min-w-0 overflow-x-hidden">
        <RoleDemandForecastChartView
          bars={bars}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>

      {showMonthlyBreakdown &&
      selected &&
      selected.monthlyPostings.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-medium text-foreground">
            Monthly breakdown for {selected.name}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {selected.monthlyPostings.map((month) => (
              <div
                key={month.forecastDate}
                className="rounded-md border border-border bg-muted/20 px-2 py-2 text-center"
              >
                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {month.month}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                  {month.predictedCount.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Average {selected.projectedPosts.toFixed(1)} · Peak{" "}
            {selected.peakPosts.toFixed(1)} across {selected.monthCount} months
          </p>
        </div>
      ) : null}

      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        #1 at top = highest projected demand · bar length = {meta?.monthCount ?? 6}
        -month average
        {meta ? ` (${meta.forecastWindow})` : ""}
      </p>
    </div>
  );
}
