"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketInsightStrip } from "@/components/market/MarketInsightStrip";
import { MarketSectionError } from "@/components/market/MarketSectionError";
import { RoleDemandForecastChart } from "@/components/market/RoleDemandForecastChart";
import {
  buildForecastChartPoints,
  filterForecastsForRole,
  FORECAST_CHART_SUBTITLE,
  FORECAST_POSTING_COUNT_LABEL,
  forecastTrendInsight,
  type ForecastAggregationMeta,
  type FutureRoleForecastBar,
  type MarketInsightCard,
} from "@/lib/job-market-insights";
import type { JobForecast } from "@/types/jobs";

const MarketForecastChartView = dynamic(
  () => import("@/components/market/MarketForecastChartView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
      </div>
    ),
  },
);

type FutureMarketPanelProps = {
  forecasts: JobForecast[];
  forecastBars: FutureRoleForecastBar[];
  forecastMeta: ForecastAggregationMeta | null;
  futureInsights: MarketInsightCard[];
  selectedRoleId: string;
  onSelectRoleId: (id: string) => void;
  loading: boolean;
  error: boolean;
  /** API succeeded but returned no forecast rows (empty ensemble table). */
  empty?: boolean;
  onRetry: () => void;
};

export function FutureMarketPanel({
  forecasts,
  forecastBars,
  forecastMeta,
  futureInsights,
  selectedRoleId,
  onSelectRoleId,
  loading,
  error,
  empty = false,
  onRetry,
}: FutureMarketPanelProps) {
  const selectedBar = forecastBars.find((bar) => bar.id === selectedRoleId);

  const roleForecasts = useMemo(
    () =>
      selectedBar ? filterForecastsForRole(forecasts, selectedBar.name) : [],
    [forecasts, selectedBar],
  );

  const chartData = useMemo(
    () => buildForecastChartPoints(roleForecasts),
    [roleForecasts],
  );

  const lineInsight = useMemo(
    () =>
      selectedBar
        ? forecastTrendInsight(roleForecasts, selectedBar.name)
        : null,
    [roleForecasts, selectedBar],
  );

  const yDomain = useMemo(() => {
    if (!chartData.length) {
      return [0, 2] as [number, number];
    }
    const min = Math.min(...chartData.map((d) => d.lower));
    const max = Math.max(...chartData.map((d) => d.upper));
    const pad = Math.max(0.1, (max - min) * 0.15);
    return [Math.max(0, min - pad), max + pad] as [number, number];
  }, [chartData]);

  if (error) {
    return (
      <MarketSectionError
        message="Forecast data could not be loaded."
        onRetry={onRetry}
      />
    );
  }

  if (loading && forecastBars.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading forecast data…</p>
      </div>
    );
  }

  if (!loading && forecastBars.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        <p>
          {empty
            ? "No forecast data is in the database yet. Job listings are available, but the ensemble forecast table has no rows — run the backend ML forecasting pipeline to populate it."
            : "Forecast data could not be loaded. Check that the API is running and try again."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 font-semibold text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MarketInsightStrip insights={futureInsights} loading={loading} />

      <RoleDemandForecastChart
        bars={forecastBars}
        selectedId={selectedRoleId}
        onSelect={onSelectRoleId}
        meta={forecastMeta}
        showMonthlyBreakdown={false}
        description="Ranked by average predicted monthly postings from one bulk forecast fetch. Click a bar to inspect progression below."
      />

      {selectedBar && chartData.length > 0 ? (
        <div className="vs-surface overflow-hidden p-4 sm:p-6 md:p-8">
          <div className="mb-4 space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              Demand progression — {selectedBar.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {FORECAST_CHART_SUBTITLE}
            </p>
            {lineInsight ? (
              <p className="max-w-2xl pt-1 text-sm leading-relaxed text-muted-foreground">
                {lineInsight}
              </p>
            ) : null}
          </div>

          <MarketForecastChartView
            chartData={chartData}
            yDomain={yDomain}
            loadingForecasts={false}
          />

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-5 rounded-full bg-primary" />
                <span>{FORECAST_POSTING_COUNT_LABEL}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0 w-5 border-t border-dashed border-primary/40" />
                <span>Confidence range</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" asChild>
              <Link href="/dashboard/learning-path/new-roadmap">
                Build roadmap
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
