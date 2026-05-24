"use client";

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
  type ForecastChartPoint,
} from "@/lib/job-market-insights";

const CHART_PRIMARY = "var(--primary)";
const CHART_GRID = "var(--border)";
const CHART_TICK = "var(--muted-foreground)";

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
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
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
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart
        data={chartData}
        margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
      >
        <CartesianGrid
          stroke={CHART_GRID}
          strokeDasharray="4 4"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fill: CHART_TICK, fontSize: 11 }}
          axisLine={{ stroke: CHART_GRID }}
          tickLine={false}
        />
        <YAxis
          domain={yDomain}
          tick={{ fill: CHART_TICK, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
          label={{
            value: FORECAST_POSTING_COUNT_LABEL,
            angle: -90,
            position: "insideLeft",
            fill: CHART_TICK,
            fontSize: 10,
            dx: 4,
          }}
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
          dot={{ r: 4, fill: CHART_PRIMARY, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
          isAnimationActive={!loadingForecasts}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
