"use client";

import { SkillDemandSkeleton } from "@/components/landing/market/MarketPulseSkeletons";
import type { InDemandSkill } from "@/types/jobs";
import {
  MARKET_TOP_K,
  normalizeSkillDemand,
  topSkillInsight,
} from "@/lib/job-market-insights";

const BAR_COLORS = [
  "bg-foreground/70",
  "bg-foreground/55",
  "bg-muted-foreground/45",
  "bg-muted-foreground/35",
  "bg-muted-foreground/28",
  "bg-muted-foreground/22",
];

export function SkillDemandPanel({
  skills,
  loading,
  title = "Top skills in demand",
  compact = false,
  limit = MARKET_TOP_K.skills,
}: {
  skills: InDemandSkill[];
  loading: boolean;
  title?: string;
  compact?: boolean;
  limit?: number;
}) {
  const topSkills = skills.slice(0, limit);
  const bars = normalizeSkillDemand(topSkills);
  const insight = topSkillInsight(topSkills);

  return (
    <div
      className={
        compact
          ? "space-y-4"
          : "rounded-lg sm:rounded-xl bg-card p-6 sm:p-8 lg:p-10 shadow-sm border border-border"
      }
    >
      <div className={compact ? "" : "mb-6 sm:mb-8"}>
        <h2
          className={
            compact
              ? "text-base font-bold text-foreground"
              : "text-lg sm:text-xl font-bold text-foreground"
          }
        >
          {title}
        </h2>
        {!compact && (
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Top {limit} skills by relative demand in indexed postings.
          </p>
        )}
        {insight && !loading && (
          <p className="mt-3 border-l border-border pl-3 text-sm leading-relaxed text-muted-foreground">
            {insight}
          </p>
        )}
      </div>

      {loading ? (
        <SkillDemandSkeleton rows={limit} />
      ) : bars.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skill demand data available yet.</p>
      ) : (
        <div className={compact ? "space-y-4" : "space-y-5"}>
          {bars.map((skill, i) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex justify-between items-center gap-2 text-sm">
                <span className="font-medium text-foreground flex items-center gap-2 min-w-0">
                  <span className="shrink-0 text-[10px] font-bold text-muted-foreground w-5">
                    #{skill.rank}
                  </span>
                  <span className="truncate">{skill.name}</span>
                </span>
                <span className="text-primary font-bold shrink-0 text-xs">
                  {skill.width}% demand
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                  style={{ width: `${skill.width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
