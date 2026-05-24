"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import {
  getJobForecasts,
  getJobProfileMatches,
  getTrendingCareers,
} from "@/lib/jobs-api";
import {
  buildForecastChartPoints,
  FORECAST_CHART_SUBTITLE,
  FORECAST_POSTING_COUNT_LABEL,
  forecastTrendInsight,
  pickDefaultForecastRole,
} from "@/lib/job-market-insights";
import { useAppStore } from "@/store/useAppStore";
import type { JobForecast } from "@/types/jobs";

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
  periodDays?: number;
};

export default function MarketForecastChart({
  periodDays = 90,
}: MarketForecastChartProps) {
  const careerInterest = useAppStore(
    (s) => s.authData.user?.career_interest ?? null,
  );

  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [forecasts, setForecasts] = useState<JobForecast[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingForecasts, setLoadingForecasts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoleOptions = useCallback(async () => {
    setLoadingRoles(true);
    setError(null);
    try {
      const [trending, matches] = await Promise.all([
        getTrendingCareers({ limit: 12, period: periodDays }),
        getJobProfileMatches({ limit: 1 }).catch(() => []),
      ]);
      const names = trending.map((t) => t.name).filter(Boolean);
      const unique = [...new Set(names)];
      const defaultRole = pickDefaultForecastRole(
        trending,
        matches,
        careerInterest,
      );
      setRoleOptions(unique.length > 0 ? unique : [defaultRole]);
      setSelectedRole((prev) => {
        if (prev && (unique.includes(prev) || prev === defaultRole)) {
          return prev;
        }
        return defaultRole;
      });
    } catch {
      setRoleOptions(["Software Engineer"]);
      setSelectedRole("Software Engineer");
      setError("Could not load role list. Showing default forecast role.");
    } finally {
      setLoadingRoles(false);
    }
  }, [careerInterest, periodDays]);

  const loadForecasts = useCallback(async (role: string) => {
    if (!role) {
      return;
    }
    setLoadingForecasts(true);
    setError(null);
    try {
      const data = await getJobForecasts({ role });
      setForecasts(data);
      if (data.length === 0) {
        setError(`No forecast data returned for “${role}”. Try another role.`);
      }
    } catch {
      setForecasts([]);
      setError(`Could not load forecasts for “${role}”.`);
    } finally {
      setLoadingForecasts(false);
    }
  }, []);

  useEffect(() => {
    void loadRoleOptions();
  }, [loadRoleOptions]);

  useEffect(() => {
    if (!selectedRole) {
      return;
    }
    void loadForecasts(selectedRole);
  }, [selectedRole, loadForecasts]);

  const chartData = useMemo(
    () => buildForecastChartPoints(forecasts),
    [forecasts],
  );

  const insight = useMemo(
    () => forecastTrendInsight(forecasts, selectedRole),
    [forecasts, selectedRole],
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

  const isLoading = loadingRoles || loadingForecasts;

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
          {insight && !isLoading && (
            <p className="max-w-xl pt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {insight}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
          <SelectField
            label="Role"
            value={selectedRole}
            onChange={setSelectedRole}
            options={selectOptions}
            disabled={loadingRoles || selectOptions.length === 0}
            placeholder="Select role…"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            disabled={isLoading}
            onClick={() => {
              void loadForecasts(selectedRole);
            }}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loadingForecasts ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="relative w-full" style={{ minHeight: 320 }}>
        {isLoading && chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            Loading forecast…
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-5 rounded-full bg-primary" />
            <span>{FORECAST_POSTING_COUNT_LABEL}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0 w-5 border-t border-dashed border-primary/40" />
            <span>Confidence range (lower–upper bound)</span>
          </div>
        </div>
        {selectedRole && (
          <span className="font-mono text-[11px] text-muted-foreground/70">
            {selectedRole}
          </span>
        )}
      </div>
    </div>
  );
}
