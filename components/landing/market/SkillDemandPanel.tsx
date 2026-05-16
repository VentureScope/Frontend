"use client";

import { SkillDemandSkeleton } from "@/components/landing/market/MarketPulseSkeletons";
import type { InDemandSkill } from "@/types/jobs";
import {
  MARKET_TOP_K,
  normalizeSkillDemand,
  topSkillInsight,
} from "@/lib/job-market-insights";

const BAR_COLORS = [
  "bg-blue-800",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-sky-500",
  "bg-violet-500",
  "bg-cyan-600",
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
          : "rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-100"
      }
    >
      <div className={compact ? "" : "mb-6 sm:mb-8"}>
        <h2
          className={
            compact
              ? "text-base font-bold text-slate-900"
              : "text-lg sm:text-xl font-bold text-slate-900"
          }
        >
          {title}
        </h2>
        {!compact && (
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Top {limit} skills by relative demand in indexed postings.
          </p>
        )}
        {insight && !loading && (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed border-l-2 border-blue-500 pl-3">
            {insight}
          </p>
        )}
      </div>

      {loading ? (
        <SkillDemandSkeleton rows={limit} />
      ) : bars.length === 0 ? (
        <p className="text-sm text-slate-500">No skill demand data available yet.</p>
      ) : (
        <div className={compact ? "space-y-4" : "space-y-5"}>
          {bars.map((skill, i) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex justify-between items-center gap-2 text-sm">
                <span className="font-medium text-slate-800 flex items-center gap-2 min-w-0">
                  <span className="shrink-0 text-[10px] font-bold text-slate-400 w-5">
                    #{skill.rank}
                  </span>
                  <span className="truncate">{skill.name}</span>
                </span>
                <span className="text-blue-600 font-bold shrink-0 text-xs">
                  {skill.width}% demand
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
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
