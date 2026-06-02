"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import { MarketSectionError } from "@/components/market/MarketSectionError";
import { useRoleForecastsQuery } from "@/hooks/queries/use-role-forecasts-query";
import {
  buildForecastChartPoints,
  FORECAST_CHART_SUBTITLE,
  FORECAST_POSTING_COUNT_LABEL,
  forecastTrendInsight,
} from "@/lib/job-market-insights";

const MarketForecastChartView = dynamic(
  () => import("@/components/market/MarketForecastChartView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
      </div>
    ),
  },
);

type MarketForecastChartProps = {
  roleOptions: string[];
  selectedRole: string;
  onSelectedRoleChange: (role: string) => void;
  loadingRoles?: boolean;
  rolesError?: boolean;
  onRetryRoles?: () => void;
};

export default function MarketForecastChart({
  roleOptions,
  selectedRole,
  onSelectedRoleChange,
  loadingRoles = false,
  rolesError = false,
  onRetryRoles,
}: MarketForecastChartProps) {
  const forecastsQuery = useRoleForecastsQuery(selectedRole);

  const chartData = useMemo(
    () => buildForecastChartPoints(forecastsQuery.data ?? []),
    [forecastsQuery.data],
  );

  const insight = useMemo(
    () => forecastTrendInsight(forecastsQuery.data ?? [], selectedRole),
    [forecastsQuery.data, selectedRole],
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

  const selectOptions = roleOptions.map((name) => ({
    value: name,
    label: name,
  }));

  const loadingForecasts = forecastsQuery.isPending || forecastsQuery.isFetching;
  const noRoles = !loadingRoles && roleOptions.length === 0;
  const forecastError =
    forecastsQuery.isError ||
    (!loadingForecasts &&
      selectedRole &&
      (forecastsQuery.data?.length ?? 0) === 0 &&
      forecastsQuery.isFetched);

  return (
    <div className="vs-surface w-full overflow-hidden p-4 sm:p-6 md:p-10">
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[28px] md:text-[30px]">
            Demand forecast
          </h2>
          <p className="text-sm font-medium text-muted-foreground sm:text-[15px]">
            {FORECAST_CHART_SUBTITLE}
          </p>
          {insight && !loadingForecasts && chartData.length > 0 && (
            <p className="max-w-xl pt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {insight}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
          <SelectField
            label="Role"
            value={selectedRole}
            onChange={onSelectedRoleChange}
            options={selectOptions}
            disabled={loadingRoles || selectOptions.length === 0}
            placeholder="Select role…"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            disabled={loadingForecasts || !selectedRole}
            onClick={() => void forecastsQuery.refetch()}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loadingForecasts ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {rolesError && (
        <MarketSectionError
          className="mb-4"
          message="Could not load trending roles for the forecast picker."
          onRetry={onRetryRoles}
        />
      )}

      {forecastsQuery.isError && (
        <MarketSectionError
          className="mb-4"
          message={`Could not load forecasts for “${selectedRole}”.`}
          onRetry={() => void forecastsQuery.refetch()}
        />
      )}

      <div className="relative w-full min-w-0" style={{ minHeight: 320 }}>
        {loadingRoles && roleOptions.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            Loading roles…
          </div>
        ) : noRoles ? (
          <div className="flex h-80 items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Trending roles are not available yet. Check that the API is running
            and try again.
          </div>
        ) : loadingForecasts && chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            Loading forecast…
          </div>
        ) : forecastError && chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center px-6 text-center text-sm text-muted-foreground">
            No forecast data returned for “{selectedRole}”. Try another role.
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
            Select a role to view its demand forecast.
          </div>
        ) : (
          <MarketForecastChartView
            chartData={chartData}
            yDomain={yDomain}
            loadingForecasts={loadingForecasts}
          />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-5 shrink-0 rounded-full bg-primary" />
            <span>{FORECAST_POSTING_COUNT_LABEL}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0 w-5 shrink-0 border-t border-dashed border-primary/40" />
            <span>Confidence range (lower–upper bound)</span>
          </div>
        </div>
        {selectedRole ? (
          <span
            className="max-w-full shrink-0 truncate font-mono text-[11px] text-muted-foreground/70 sm:max-w-[220px] sm:text-right"
            title={selectedRole}
          >
            {selectedRole}
          </span>
        ) : null}
      </div>
    </div>
  );
}
