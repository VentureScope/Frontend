"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YAxisTickContentProps } from "recharts";
import type { FutureRoleForecastBar } from "@/lib/job-market-insights";
import { FORECAST_POSTING_COUNT_LABEL } from "@/lib/job-market-insights";

const CHART_PRIMARY = "var(--primary)";
const CHART_MUTED = "color-mix(in oklab, var(--primary) 35%, var(--muted))";
const CHART_GRID = "var(--border)";
const CHART_TICK = "var(--muted-foreground)";

type ChartLayout = "compact" | "medium" | "full";

function resolveChartLayout(): ChartLayout {
  if (typeof window === "undefined") {
    return "full";
  }
  if (window.matchMedia("(max-width: 639px)").matches) {
    return "compact";
  }
  if (window.matchMedia("(max-width: 767px)").matches) {
    return "medium";
  }
  return "full";
}

function useChartLayout(): ChartLayout {
  const [layout, setLayout] = useState<ChartLayout>("full");

  useEffect(() => {
    const update = () => setLayout(resolveChartLayout());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

function truncateRoleLabel(name: string, maxLength: number): string {
  if (name.length <= maxLength) {
    return name;
  }
  return `${name.slice(0, maxLength - 1)}…`;
}

function yAxisWidth(layout: ChartLayout): number {
  switch (layout) {
    case "compact":
      return 28;
    case "medium":
      return 96;
    default:
      return 168;
  }
}

type BarTooltipProps = {
  active?: boolean;
  payload?: {
    payload?: FutureRoleForecastBar;
  }[];
};

function BarTooltip({ active, payload }: BarTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  const row = payload[0]?.payload;
  if (!row) {
    return null;
  }
  return (
    <div className="max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground">
        #{row.rank} · {row.name}
      </p>
      <p className="mt-1 text-muted-foreground">
        {row.monthCount}-mo avg:{" "}
        <span className="font-mono font-semibold text-primary">
          {row.projectedPosts.toFixed(1)}
        </span>{" "}
        {FORECAST_POSTING_COUNT_LABEL.toLowerCase()}
      </p>
      {row.monthlyPostings.length > 0 ? (
        <ul className="mt-2 space-y-0.5 border-t border-border pt-2">
          {row.monthlyPostings.map((month) => (
            <li
              key={month.forecastDate}
              className="flex justify-between gap-3 text-muted-foreground"
            >
              <span>{month.month}</span>
              <span className="font-mono text-foreground">
                {month.predictedCount.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function RoleDemandForecastChartView({
  bars,
  selectedId,
  onSelect,
}: {
  bars: FutureRoleForecastBar[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const layout = useChartLayout();
  const axisWidth = yAxisWidth(layout);
  const compact = layout === "compact";
  const chartHeight = Math.max(320, bars.length * (compact ? 32 : 36) + 48);

  const rankByName = useMemo(
    () => new Map(bars.map((bar) => [bar.name, bar.rank])),
    [bars],
  );

  const renderYAxisTick = useMemo(() => {
    return (props: YAxisTickContentProps) => {
      const x = Number(props.x ?? 0);
      const y = Number(props.y ?? 0);
      const name = String(props.payload?.value ?? "");
      const rank = rankByName.get(name);
      const label =
        layout === "compact"
          ? `#${rank ?? ""}`
          : truncateRoleLabel(name, layout === "medium" ? 11 : 24);

      return (
        <text
          x={x}
          y={y}
          dy={4}
          textAnchor="end"
          fill={CHART_TICK}
          fontSize={compact ? 10 : 11}
        >
          {label}
        </text>
      );
    };
  }, [compact, layout, rankByName]);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={bars}
        layout="vertical"
        margin={{
          top: 8,
          right: compact ? 8 : 16,
          left: compact ? 0 : 4,
          bottom: compact ? 4 : 8,
        }}
        barCategoryGap={compact ? "12%" : "18%"}
      >
        <CartesianGrid
          stroke={CHART_GRID}
          strokeDasharray="4 4"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: CHART_TICK, fontSize: compact ? 10 : 11 }}
          axisLine={{ stroke: CHART_GRID }}
          tickLine={false}
          domain={[0, "auto"]}
          tickCount={compact ? 4 : 5}
          label={
            compact
              ? undefined
              : {
                  value: "Avg. predicted postings",
                  position: "insideBottom",
                  offset: -4,
                  fill: CHART_TICK,
                  fontSize: 11,
                }
          }
        />
        <YAxis
          type="category"
          dataKey="name"
          width={axisWidth}
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={renderYAxisTick}
        />
        <Tooltip
          content={<BarTooltip />}
          cursor={{ fill: "var(--muted)", opacity: 0.35 }}
        />
        <Bar
          dataKey="projectedPosts"
          radius={[0, 6, 6, 0]}
          onClick={(entry) => {
            const row = entry?.payload as FutureRoleForecastBar | undefined;
            if (row?.id) {
              onSelect(row.id);
            }
          }}
          className="cursor-pointer"
        >
          {bars.map((bar) => (
            <Cell
              key={bar.id}
              fill={bar.id === selectedId ? CHART_PRIMARY : CHART_MUTED}
              stroke={bar.id === selectedId ? CHART_PRIMARY : "transparent"}
              strokeWidth={bar.id === selectedId ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
