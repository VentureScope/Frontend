import Link from "next/link";
import { MarketTrendsCardSkeleton } from "@/components/dashboard/DashboardSkeletons";
import type { InDemandSkill, TrendingCareer } from "@/types/jobs";

const BAR_COLORS = [
  "bg-chart-1/90",
  "bg-chart-1/70",
  "bg-chart-4/80",
  "bg-chart-1",
  "bg-chart-3/80",
  "bg-chart-2/70",
  "bg-chart-4",
];

function barHeights(careers: TrendingCareer[]): number[] {
  if (careers.length === 0) return [25, 60, 45, 75, 55, 90, 70];
  const max = Math.max(...careers.map((c) => c.job_count), 1);
  return careers
    .slice(0, 7)
    .map((c) => Math.max(12, Math.round((c.job_count / max) * 100)));
}

export default function MarketTrendsCard({
  trending,
  skills,
  loading,
}: {
  trending: TrendingCareer[];
  skills: InDemandSkill[];
  loading?: boolean;
}) {
  if (loading) {
    return <MarketTrendsCardSkeleton />;
  }

  const bars = barHeights(trending);
  const lead = trending[0];
  const growth =
    lead?.growth_pct != null && lead.growth_pct > 0
      ? `+${lead.growth_pct.toFixed(0)}%`
      : lead
        ? `${lead.job_count.toLocaleString()} openings`
        : "Live market data";

  return (
    <Link
      href="/dashboard/market-trends"
      className="vs-surface block h-full p-6 transition-colors hover:border-primary/25 sm:p-8 lg:p-10"
    >
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Market trends
          </h2>
          <p className="text-body text-muted-foreground">
            {lead ? (
              <>
                {lead.name} demand:{" "}
                <span className="font-semibold text-success">{growth}</span>
              </>
            ) : (
              "Explore hiring demand and in-demand skills"
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((s) => (
            <span
              key={s.skill}
              className="vs-accent-chip text-label rounded-md px-3 py-1"
            >
              {s.skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex h-32 items-end justify-between gap-2 sm:h-48 sm:gap-4">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`w-full rounded-md transition-all hover:opacity-90 ${BAR_COLORS[i % BAR_COLORS.length]}`}
            style={{ height: `${h}%`, opacity: h < 60 ? 0.45 : 1 }}
          />
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold text-primary">
        View full market insights →
      </p>
    </Link>
  );
}
