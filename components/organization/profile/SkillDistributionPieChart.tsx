"use client";

import { useMemo } from "react";
import type { UserOrgSkillBenchmark } from "@/types/organization-profile";

/** Matches executive palette chart tokens in globals.css */
const SLICE_COLORS = [
  "#4a6b5a",
  "#8a7348",
  "#5c6578",
  "#6b8f7a",
  "#9e5d5d",
  "#6b9a7a",
  "#a8925a",
];

type Slice = {
  skill: string;
  value: number;
  color: string;
  startPct: number;
  endPct: number;
  roleMedian: number;
  orgTop: number;
};

function buildSlices(benchmarks: UserOrgSkillBenchmark[]): Slice[] {
  const total = benchmarks.reduce((sum, b) => sum + b.yourScore, 0) || 1;
  let cumulative = 0;

  return benchmarks.map((b, index) => {
    const startPct = (cumulative / total) * 100;
    cumulative += b.yourScore;
    const endPct = (cumulative / total) * 100;
    return {
      skill: b.skill,
      value: b.yourScore,
      color: SLICE_COLORS[index % SLICE_COLORS.length],
      startPct,
      endPct,
      roleMedian: b.roleMedian,
      orgTop: b.orgTop,
    };
  });
}

function conicGradientFromSlices(slices: Slice[]): string {
  if (slices.length === 0) {
    return "conic-gradient(hsl(var(--muted)) 0deg 360deg)";
  }
  const stops = slices.map(
    (s) => `${s.color} ${s.startPct}% ${s.endPct}%`,
  );
  return `conic-gradient(${stops.join(", ")})`;
}

type Props = {
  benchmarks: UserOrgSkillBenchmark[];
  techFilterLabel?: string;
};

export function SkillDistributionPieChart({
  benchmarks,
  techFilterLabel,
}: Props) {
  const slices = useMemo(() => buildSlices(benchmarks), [benchmarks]);
  const gradient = useMemo(() => conicGradientFromSlices(slices), [slices]);

  const avgYou = benchmarks.length
    ? Math.round(
        benchmarks.reduce((s, b) => s + b.yourScore, 0) / benchmarks.length,
      )
    : 0;

  if (benchmarks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No skills match this tech stack filter.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <div className="relative shrink-0">
        <div
          className="h-52 w-52 rounded-full shadow-inner ring-1 ring-border"
          style={{ background: gradient }}
          role="img"
          aria-label={`Skill distribution pie chart${techFilterLabel ? ` for ${techFilterLabel}` : ""}`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-card text-center shadow-sm ring-1 ring-border">
            <span className="text-2xl font-bold text-primary">{avgYou}%</span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Avg. you
            </span>
            <span className="mt-0.5 text-[10px] text-muted-foreground">
              {benchmarks.length} skill{benchmarks.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      <ul className="w-full max-w-md space-y-3 lg:pt-2">
        {slices.map((slice) => (
          <li
            key={slice.skill}
            className="flex items-start gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5"
          >
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{slice.skill}</p>
              <p className="text-xs text-muted-foreground">
                Your share of profile:{" "}
                <span className="font-medium text-foreground">
                  {Math.round(
                    (slice.value /
                      benchmarks.reduce((s, b) => s + b.yourScore, 0)) *
                      100,
                  )}
                  %
                </span>
                {" · "}
                You {slice.value}%
              </p>
              <p className="text-[10px] text-muted-foreground">
                Role median {slice.roleMedian}% · Org top {slice.orgTop}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
