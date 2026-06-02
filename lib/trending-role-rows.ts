import {
  formatCompactNumber,
  formatGrowthLabel,
  formatRoadmapRoleMetric,
} from "@/lib/job-market-insights";
import type { TrendingCareer } from "@/types/jobs";

const ICONS = ["Cpu", "Share2", "Shield", "BarChart2"] as const;

export type TrendingRoleRow = {
  id: string;
  title: string;
  badge: string;
  badgeType: "high-demand" | "steady-growth" | "declining";
  metricValue: string;
  metricLabel: string;
  iconName: string;
  description: string;
  trendName: string;
  rank?: number;
};

function currentRoleBadge(
  growth: number,
  jobCount: number,
): Pick<TrendingRoleRow, "badge" | "badgeType"> {
  const high = growth >= 8 || jobCount > 5000;
  return {
    badge: high ? "STRONG SIGNAL" : "EMERGING",
    badgeType: high ? "high-demand" : "steady-growth",
  };
}

function futureRoleBadge(
  rank: number,
  projectedPosts: number,
): Pick<TrendingRoleRow, "badge" | "badgeType"> {
  if (rank <= 3 || projectedPosts >= 15) {
    return { badge: "TOP DEMAND", badgeType: "high-demand" };
  }
  if (projectedPosts >= 8) {
    return { badge: "HIGH VOLUME", badgeType: "high-demand" };
  }
  if (projectedPosts >= 4) {
    return { badge: "MODERATE", badgeType: "steady-growth" };
  }
  return { badge: "LOWER VOLUME", badgeType: "steady-growth" };
}

export function mapTrendingToRoleRows(
  careers: TrendingCareer[],
  variant: "current" | "future" = "current",
  lookbackPhrase = "the last 3 months",
): TrendingRoleRow[] {
  return careers.map((c, i) => {
    const growth = c.growth_pct ?? 0;
    const growthText = formatGrowthLabel(c.growth_pct);
    const badge =
      variant === "future"
        ? futureRoleBadge(i + 1, c.job_count)
        : currentRoleBadge(growth, c.job_count);
    const metric = formatRoadmapRoleMetric(c, variant);

    const trendDetail =
      variant === "future"
        ? `${growthText.label} across forecast window`
        : `${growthText.label} vs ${lookbackPhrase}`;

    const context =
      variant === "future"
        ? `Avg. ${formatCompactNumber(c.job_count)} predicted monthly postings`
        : c.company_count > 0
          ? `${formatCompactNumber(c.company_count)} employers in market data`
          : "Indexed market listings";

    const rankNote =
      variant === "future"
        ? `Ranked #${i + 1} by projected postings · `
        : "";

    return {
      id: `trend-${i}-${encodeURIComponent(c.name)}`,
      title: c.name,
      ...badge,
      metricValue: metric.value,
      metricLabel: metric.label,
      iconName: ICONS[i % ICONS.length],
      description: `${rankNote}${context} · ${trendDetail}`,
      trendName: c.name,
      rank: variant === "future" ? i + 1 : undefined,
    };
  });
}
