import { getCurrentTrendingRoles } from "@/lib/jobs-api";
import { getMarketPulseFallbackData } from "@/lib/market-pulse-fallback";
import type { OrgRoadmapFocusArea } from "@/types/organization-roadmap";
import type { TrendingCareer } from "@/types/jobs";

const AREA_TREND_KEYWORDS: Record<string, string[]> = {
  frontend: ["front", "ui", "ux", "react", "web", "mobile", "full stack"],
  backend: ["back", "api", "server", "platform", "software", "java", "node"],
  "data-science": ["data", "ml", "machine learning", "analyst", "scientist"],
  cybersecurity: ["security", "cyber", "compliance", "secops"],
  "product-design": ["design", "product", "ux", "research"],
  engineering: ["devops", "sre", "platform", "infrastructure", "cloud", "engineer"],
};

function keywordsForArea(area: OrgRoadmapFocusArea): string[] {
  const base = AREA_TREND_KEYWORDS[area.id] ?? [];
  const fromTitle = area.title.toLowerCase().split(/\s+/);
  const fromTrend = area.generationTrendName.toLowerCase().split(/\s+/);
  return [...new Set([...base, ...fromTitle, ...fromTrend])].filter(
    (k) => k.length > 2,
  );
}

function careerMatchesArea(career: TrendingCareer, keywords: string[]): boolean {
  const name = career.name.toLowerCase();
  return keywords.some((k) => name.includes(k));
}

/** Pick trending roles most relevant to the selected company practice area. */
export function filterTrendingForArea(
  area: OrgRoadmapFocusArea,
  careers: TrendingCareer[],
  limit = 5,
): TrendingCareer[] {
  const keywords = keywordsForArea(area);
  const matched = careers.filter((c) => careerMatchesArea(c, keywords));
  const pool = matched.length > 0 ? matched : careers;
  return [...pool]
    .sort((a, b) => (b.job_count ?? 0) - (a.job_count ?? 0))
    .slice(0, limit);
}

export function formatTrendingMarketContext(
  careers: TrendingCareer[],
  areaTitle: string,
): string {
  if (careers.length === 0) {
    return `Market trends: no live data for ${areaTitle}; prioritize organization context.`;
  }
  const lines = careers.map((c) => {
    const growth =
      c.growth_pct != null && c.growth_pct > 0
        ? `, +${c.growth_pct.toFixed(0)}% growth`
        : "";
    return `${c.name} (${c.job_count.toLocaleString()} openings${growth})`;
  });
  return [
    `Market pulse (last 30 days) for ${areaTitle}: ${lines.join("; ")}.`,
    "Blend rising market skills with the organization's team and stack—team context stays primary.",
  ].join(" ");
}

export async function fetchTrendingCareersForOrgRoadmap(): Promise<
  TrendingCareer[]
> {
  try {
    return await getCurrentTrendingRoles({ limit: 24, period: 30 });
  } catch {
    return getMarketPulseFallbackData().trending;
  }
}
