"use client";

import { SelectField } from "@/components/ui/select-field";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import { isMarketPeriodId } from "@/lib/market-analytics-period";
import { cn } from "@/lib/utils";

type MarketAnalyticsPeriodSelectProps = {
  disabled?: boolean;
  /** Shows subtle updating state without blocking interaction. */
  busy?: boolean;
  className?: string;
  /** Shorter label for tight headers */
  compact?: boolean;
};

export function MarketAnalyticsPeriodSelect({
  disabled,
  busy,
  className,
  compact = false,
}: MarketAnalyticsPeriodSelectProps) {
  const { periodId, setPeriodId, periodOptions } = useMarketAnalyticsPeriod();

  return (
    <SelectField
      label={compact ? "Period" : "Analytics period"}
      value={periodId}
      onChange={(value) => {
        if (isMarketPeriodId(value)) {
          setPeriodId(value);
        }
      }}
      options={periodOptions.map((p) => ({
        value: p.id,
        label: p.label,
      }))}
      disabled={disabled}
      hint={
        compact
          ? busy
            ? "Updating market data…"
            : undefined
          : busy
            ? "Updating market data for this period…"
            : "Trending roles and job stats use this lookback window."
      }
      className={cn(compact ? "min-w-[140px]" : "w-full max-w-xs", className)}
    />
  );
}
