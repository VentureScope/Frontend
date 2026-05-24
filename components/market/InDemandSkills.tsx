import {
  MARKET_TOP_K,
  normalizeSkillDemand,
} from "@/lib/job-market-insights";
import type { InDemandSkill } from "@/types/jobs";

export default function InDemandSkills({
  skills,
  loading,
}: {
  skills: InDemandSkill[];
  loading?: boolean;
}) {
  const rows = normalizeSkillDemand(skills.slice(0, MARKET_TOP_K.skills));

  return (
    <div className="vs-surface p-6 sm:p-8">
      <h3 className="mb-6 text-lg font-bold text-foreground sm:mb-8 sm:text-xl">
        In-Demand Skills
      </h3>
      <div className="space-y-6 sm:space-y-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted" />
            </div>
          ))
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No skill demand data available yet.
          </p>
        ) : (
          rows.map((s) => (
            <div key={s.name} className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs font-bold sm:text-sm">
                <span className="text-foreground">{s.name}</span>
                <span className="text-primary">#{s.rank}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted sm:h-2">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${s.width}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
