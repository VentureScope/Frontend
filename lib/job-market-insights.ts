import type {
  InDemandSkill,
  JobByCategoryRow,
  JobMatch,
  JobStats,
  TrendingCareer,
} from "@/types/jobs";

/** Max items shown on public market analytics surfaces. */
export const MARKET_TOP_K = {
  skills: 5,
  trending: 4,
  categoryJobs: 4,
  profileMatches: 3,
} as const;

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return n.toLocaleString();
}

function pickString(
  row: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

export interface ParsedCategoryJob {
  id: string;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  category?: string;
}

export function parseCategoryJob(
  row: JobByCategoryRow,
  index: number,
): ParsedCategoryJob {
  const r = row as Record<string, unknown>;
  const title =
    pickString(r, ["job_title", "title", "name", "role", "position"]) ??
    "Open position";
  const company =
    pickString(r, ["company_name", "company", "employer", "organization"]) ??
    "Company confidential";
  const rawId = r.id ?? r.job_id;
  const id =
    typeof rawId === "string" || typeof rawId === "number"
      ? String(rawId)
      : `job-${index}`;

  return {
    id,
    title,
    company,
    location: pickString(r, ["city", "location", "region", "country"]),
    jobType: pickString(r, ["job_type", "type", "employment_type"]),
    category: pickString(r, ["category", "job_category"]),
  };
}

export function normalizeSkillDemand(
  skills: InDemandSkill[],
): { name: string; width: number; rank: number }[] {
  if (!skills.length) {
    return [];
  }
  const max = Math.max(...skills.map((s) => s.demand), 1);
  return skills.map((s, i) => ({
    name: s.skill,
    width: Math.max(10, Math.round((s.demand / max) * 100)),
    rank: i + 1,
  }));
}

export function topSkillInsight(skills: InDemandSkill[]): string | null {
  if (!skills.length) {
    return null;
  }
  const top = skills[0];
  const second = skills[1];
  if (second) {
    return `${top.skill} leads hiring demand, followed closely by ${second.skill}. Upskilling in both widens your match pool.`;
  }
  return `${top.skill} is the strongest signal in current postings—prioritize it in portfolios and learning plans.`;
}

export function statsInsight(stats: JobStats): string {
  const employers = formatCompactNumber(stats.unique_companies);
  const roles = formatCompactNumber(stats.total_jobs);
  return `${employers} employers are actively hiring across ${stats.unique_categories} role categories, with ${roles} open roles indexed in our dataset.`;
}

export function trendingInsight(careers: TrendingCareer[]): string | null {
  if (!careers.length) {
    return null;
  }
  const busiest = [...careers].sort((a, b) => b.job_count - a.job_count)[0];
  return `${busiest.name} leads hiring volume with ${formatCompactNumber(busiest.job_count)} open roles across ${formatCompactNumber(busiest.company_count)} companies.`;
}

export function formatGrowthLabel(growth: number | null | undefined): {
  label: string;
  tone: "up" | "steady" | "down";
} {
  if (growth == null) {
    return { label: "Stable demand", tone: "steady" };
  }
  if (growth > 0) {
    return { label: `+${growth.toFixed(0)}% growth`, tone: "up" };
  }
  if (growth < 0) {
    return { label: `${growth.toFixed(0)}% decline`, tone: "down" };
  }
  return { label: "Stable demand", tone: "steady" };
}

export function matchFitLabel(distance: number | null | undefined): {
  label: string;
  pct: number;
} {
  if (distance == null || Number.isNaN(distance)) {
    return { label: "Strong fit", pct: 82 };
  }
  const pct = Math.max(55, Math.min(98, Math.round(100 - distance * 12)));
  if (pct >= 88) {
    return { label: "Excellent fit", pct };
  }
  if (pct >= 75) {
    return { label: "Strong fit", pct };
  }
  return { label: "Good fit", pct };
}

export function profileMatchesInsight(matches: JobMatch[]): string | null {
  if (!matches.length) {
    return null;
  }
  const top = matches[0];
  return `Your profile aligns best with ${top.job_title} at ${top.company_name}${top.city ? ` (${top.city})` : ""}.`;
}

export function marketCoverageIndex(stats: JobStats): number {
  if (stats.total_jobs <= 0) {
    return 64;
  }
  const employerDensity =
    stats.unique_companies / Math.max(stats.total_jobs, 1);
  const categoryBreadth = Math.min(stats.unique_categories / 20, 1);
  return Math.min(
    95,
    Math.round(45 + employerDensity * 100 + categoryBreadth * 25),
  );
}
