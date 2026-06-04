"use client";

import { useEffect, useMemo, useState } from "react";
import { MarketInsightStrip } from "@/components/market/MarketInsightStrip";
import { MarketSectionError } from "@/components/market/MarketSectionError";
import { RoleDemandForecastChart } from "@/components/market/RoleDemandForecastChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobForecastsQuery } from "@/hooks/queries/use-job-forecasts-query";
import { logMarketSectionFailure } from "@/lib/log-jobs-api";
import {
  buildFutureRoleForecastBars,
  buildMarketFutureInsights,
  getForecastAggregationMeta,
  type FutureRoleForecastBar,
} from "@/lib/job-market-insights";
import type { JobForecast } from "@/types/jobs";

function findDefaultForecastBarId(bars: FutureRoleForecastBar[]): string {
  return bars[0]?.id ?? "";
}

export function LandingMarketAnalysisSection() {
  const forecastsQuery = useJobForecastsQuery();
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const forecasts: JobForecast[] = forecastsQuery.data ?? [];
  const loadingForecasts = forecastsQuery.isPending;
  const forecastError = forecastsQuery.isError;
  const forecastsEmpty =
    !loadingForecasts && !forecastError && forecasts.length === 0;

  const forecastBars = useMemo(
    () => buildFutureRoleForecastBars(forecasts),
    [forecasts],
  );

  const forecastMeta = useMemo(
    () => getForecastAggregationMeta(forecasts),
    [forecasts],
  );

  const selectedBar = useMemo(
    () => forecastBars.find((bar) => bar.id === selectedRoleId) ?? null,
    [forecastBars, selectedRoleId],
  );

  const futureInsights = useMemo(
    () => buildMarketFutureInsights(forecastBars, forecastMeta, selectedBar),
    [forecastBars, forecastMeta, selectedBar],
  );

  useEffect(() => {
    if (forecastBars.length === 0) {
      setSelectedRoleId("");
      return;
    }
    setSelectedRoleId((prev) => {
      if (prev && forecastBars.some((bar) => bar.id === prev)) {
        return prev;
      }
      return findDefaultForecastBarId(forecastBars);
    });
  }, [forecastBars]);

  const retryForecasts = () => {
    void forecastsQuery.refetch().catch((err) => {
      logMarketSectionFailure("LandingMarketAnalysisSection", err);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-label text-primary">Forward-looking</p>
        <h2
          id="forecast-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Projected role demand
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Ensemble forecasts ranked by average predicted monthly postings.
          Click a bar to explore projected demand for each role.
        </p>
      </div>

      <MarketInsightStrip
        insights={futureInsights}
        loading={loadingForecasts && forecastBars.length === 0}
      />

      {forecastError ? (
        <MarketSectionError
          message="Forecast data could not be loaded."
          onRetry={retryForecasts}
        />
      ) : loadingForecasts && forecastBars.length === 0 ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : !loadingForecasts && forecastBars.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <p>
            {forecastsEmpty
              ? "No forecast data is in the database yet. Live listings are still available above."
              : "Forecast data could not be loaded. Check that the API is running and try again."}
          </p>
          <button
            type="button"
            onClick={retryForecasts}
            className="mt-3 font-semibold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <RoleDemandForecastChart
          bars={forecastBars}
          selectedId={selectedRoleId}
          onSelect={setSelectedRoleId}
          meta={forecastMeta}
          showMonthlyBreakdown={false}
          description="Ranked by average predicted monthly postings. Click a bar to inspect projected demand for that role."
        />
      )}
    </div>
  );
}
