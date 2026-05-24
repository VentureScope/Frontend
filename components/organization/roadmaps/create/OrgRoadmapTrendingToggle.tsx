"use client";

import { TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatGrowthLabel } from "@/lib/job-market-insights";
import type { TrendingCareer } from "@/types/jobs";

export function OrgRoadmapTrendingToggle({
  enabled,
  onEnabledChange,
  loading,
  matchedTrends,
  disabled,
}: {
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  loading?: boolean;
  matchedTrends: TrendingCareer[];
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "vs-surface rounded-[20px] border p-5 transition-colors",
        enabled ? "border-primary/30 bg-primary/5" : "border-border",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              enabled ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-label text-muted-foreground">Step 3 · Optional</p>
            <h3 className="text-base font-semibold text-foreground">
              Include market trends
            </h3>
            <p className="max-w-xl text-sm text-muted-foreground">
              Includes current trending roles in the server generation context for
              this area. Your company profile and team skills stay the main signal.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:pt-1">
          <span className="text-xs font-medium text-muted-foreground">
            {enabled ? "On" : "Off"}
          </span>
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
            disabled={disabled}
            aria-label="Include market trends in roadmap generation"
          />
        </div>
      </div>

      {enabled ? (
        <div className="mt-4 border-t border-border pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading market data…</p>
          ) : matchedTrends.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No matching trends in preview; the server will still use market data
              when available for this area.
            </p>
          ) : (
            <>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Related current trending roles (preview)
              </p>
              <ul className="flex flex-wrap gap-2">
                {matchedTrends.map((t) => {
                  const growth = formatGrowthLabel(t.growth_pct);
                  return (
                  <li
                    key={t.name}
                    className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs text-foreground"
                  >
                    {t.name}
                    <span className="ml-1.5 text-muted-foreground">
                      · {growth.label}
                    </span>
                  </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
