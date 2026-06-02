"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FORECAST_POSTING_COUNT_LABEL,
  formatCompactNumber,
  type ForecastChartPoint,
} from "@/lib/job-market-insights";

const CHART_PRIMARY = "var(--primary)";
const CHART_GRID = "var(--border)";
const CHART_TICK = "var(--muted-foreground)";

type ChartLayout = "compact" | "wide";

function resolveChartLayout(): ChartLayout {
  if (typeof window === "undefined") {
    return "wide";
  }
  return window.matchMedia("(max-width: 639px)").matches ? "compact" : "wide";
}

function useChartLayout(): ChartLayout {
  const [layout, setLayout] = useState<ChartLayout>("wide");

  useEffect(() => {
    const update = () => setLayout(resolveChartLayout());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

function formatChartAxisValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) {
    return formatCompactNumber(value);
  }
  if (abs >= 100) {
    return value.toFixed(0);
  }
  if (abs >= 10) {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}

function estimateYAxisWidth(domain: [number, number]): number {
  const samples = [
    domain[0],
    domain[1],
    domain[0] + (domain[1] - domain[0]) * 0.25,
    domain[0] + (domain[1] - domain[0]) * 0.5,
    domain[0] + (domain[1] - domain[0]) * 0.75,
  ];
  const maxLen = Math.max(
    ...samples.map((value) => formatChartAxisValue(value).length),
    3,
  );
  return Math.max(44, Math.min(68, maxLen * 7 + 14));
}

type ForecastTooltipProps = {
  active?: boolean;
  payload?: {
    payload?: ForecastChartPoint;
  }[];
};

function ForecastTooltip({ active, payload }: ForecastTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  const row = payload[0]?.payload;
  if (!row) {
    return null;
  }
  return (
    <div className="max-w-[220px] rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground">{row.month}</p>
      <p className="mt-1 text-muted-foreground">
        {FORECAST_POSTING_COUNT_LABEL}:{" "}
        <span className="font-mono font-semibold text-primary">
          {row.predicted}
        </span>
      </p>
      <p className="text-muted-foreground">
        Range:{" "}
        <span className="font-mono">
          {row.lower} – {row.upper}
        </span>
      </p>
    </div>
  );
}

export default function MarketForecastChartView({
  chartData,
  yDomain,
  loadingForecasts,
}: {
  chartData: ForecastChartPoint[];
  yDomain: [number, number];
  loadingForecasts: boolean;
}) {
  const layout = useChartLayout();
  const yAxisWidth = useMemo(() => estimateYAxisWidth(yDomain), [yDomain]);

  const denseXLabels = chartData.length > 4;
  const angledXLabels =
    chartData.length > 6 || (layout === "compact" && denseXLabels);
  const chartHeight = angledXLabels ? 360 : 320;
  const xAxisHeight = angledXLabels ? 52 : 32;

  const chartMargin = useMemo(
    () => ({
      top: 12,
      right: layout === "compact" ? 8 : 16,
      left: 4,
      bottom: angledXLabels ? 4 : 0,
    }),
    [layout, angledXLabels],
  );

  return (
    <div className="w-full min-w-0">
      <p className="mb-2 pl-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {FORECAST_POSTING_COUNT_LABEL}
      </p>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ComposedChart data={chartData} margin={chartMargin}>
          <CartesianGrid
            stroke={CHART_GRID}
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: CHART_TICK, fontSize: layout === "compact" ? 10 : 11 }}
            axisLine={{ stroke: CHART_GRID }}
            tickLine={false}
            minTickGap={layout === "compact" ? 12 : 20}
            interval={denseXLabels ? "preserveStartEnd" : 0}
            angle={angledXLabels ? -35 : 0}
            textAnchor={angledXLabels ? "end" : "middle"}
            height={xAxisHeight}
            dy={angledXLabels ? 4 : 0}
          />
          <YAxis
            domain={yDomain}
            tick={{
              fill: CHART_TICK,
              fontSize: layout === "compact" ? 10 : 11,
            }}
            tickFormatter={formatChartAxisValue}
            axisLine={false}
            tickLine={false}
            width={yAxisWidth}
            tickMargin={6}
          />
          <Tooltip content={<ForecastTooltip />} />
          <Line
            type="monotone"
            dataKey="upper"
            stroke={CHART_PRIMARY}
            strokeWidth={1.5}
            strokeOpacity={0.35}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={!loadingForecasts}
          />
          <Line
            type="monotone"
            dataKey="lower"
            stroke={CHART_PRIMARY}
            strokeWidth={1.5}
            strokeOpacity={0.35}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={!loadingForecasts}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke={CHART_PRIMARY}
            strokeWidth={2.5}
            dot={{ r: layout === "compact" ? 3 : 4, fill: CHART_PRIMARY, strokeWidth: 0 }}
            activeDot={{ r: layout === "compact" ? 5 : 6 }}
            isAnimationActive={!loadingForecasts}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
