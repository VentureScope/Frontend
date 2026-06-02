import type {
  InDemandSkill,
  JobByCategoryRow,
  JobForecast,
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
  hiringCompanies: 3,
} as const;

/** User-facing label for `/api/jobs/forecasts` `predicted_count` (monthly job postings). */
export const FORECAST_POSTING_COUNT_LABEL = "Predicted postings";

export const FORECAST_CHART_SUBTITLE =
  "Monthly predicted job posting count for the selected role (ensemble forecast).";

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

export interface EmergingTrendItem {
  id: string;
  title: string;
  description: string;
  kind: "role" | "skill";
}

/** Sidebar “emerging” signals: roles with positive growth, then rising skills. */
export function buildEmergingTrendItems(
  careers: TrendingCareer[],
  skills: InDemandSkill[],
  limit = 2,
  lookbackPhrase = "the last 3 months",
): EmergingTrendItem[] {
  const items: EmergingTrendItem[] = [];
  const usedTitles = new Set<string>();

  const risingRoles = [...careers]
    .filter((c) => (c.growth_pct ?? 0) > 0)
    .sort((a, b) => (b.growth_pct ?? 0) - (a.growth_pct ?? 0));

  for (const role of risingRoles) {
    if (items.length >= limit) break;
    const growth = formatGrowthLabel(role.growth_pct);
    items.push({
      id: `role-${role.name}`,
      title: role.name,
      description: `${growth.label} in ${lookbackPhrase} · ${formatCompactNumber(role.job_count)} openings across ${formatCompactNumber(role.company_count)} employers.`,
      kind: "role",
    });
    usedTitles.add(role.name.toLowerCase());
  }

  if (items.length < limit) {
    const volumeLeaders = [...careers]
      .filter((c) => !usedTitles.has(c.name.toLowerCase()))
      .sort((a, b) => b.job_count - a.job_count);
    for (const role of volumeLeaders) {
      if (items.length >= limit) break;
      items.push({
        id: `role-vol-${role.name}`,
        title: role.name,
        description: `High hiring volume — ${formatCompactNumber(role.job_count)} indexed roles across ${formatCompactNumber(role.company_count)} companies.`,
        kind: "role",
      });
      usedTitles.add(role.name.toLowerCase());
    }
  }

  for (let i = 0; i < skills.length && items.length < limit; i++) {
    const skill = skills[i];
    if (usedTitles.has(skill.skill.toLowerCase())) continue;
    items.push({
      id: `skill-${skill.skill}`,
      title: skill.skill,
      description: `Rising skill demand in live postings (demand score ${skill.demand.toLocaleString()}).`,
      kind: "skill",
    });
    usedTitles.add(skill.skill.toLowerCase());
  }

  return items;
}

/** Side metric on new-roadmap role cards — avoids implying live job openings. */
export function formatRoadmapRoleMetric(
  career: TrendingCareer,
  variant: "current" | "future",
): { value: string; label: string } {
  if (variant === "future" && career.job_count > 0) {
    return {
      value: career.job_count.toFixed(1),
      label: "Avg. predicted monthly postings",
    };
  }

  const growth = career.growth_pct;
  const hasGrowth = growth != null && !Number.isNaN(growth);

  if (hasGrowth) {
    const value =
      growth > 0
        ? `+${Math.abs(growth).toFixed(0)}%`
        : growth < 0
          ? `−${Math.abs(growth).toFixed(0)}%`
          : "0%";
    return {
      value,
      label:
        variant === "future"
          ? "Projected demand change"
          : "30-day market trend",
    };
  }

  if (career.company_count > 0) {
    return {
      value: formatCompactNumber(career.company_count),
      label: "Employers in dataset",
    };
  }

  if (career.job_count > 0) {
    return {
      value: formatCompactNumber(career.job_count),
      label: "Indexed role listings",
    };
  }

  return { value: "—", label: "Market signal" };
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

export interface HiringCompanyRow {
  name: string;
  count: number;
  category?: string;
}

/** Rank employers by listing count from sampled category job rows. */
export function aggregateTopHiringCompanies(
  jobs: ParsedCategoryJob[],
  topN = MARKET_TOP_K.hiringCompanies,
): HiringCompanyRow[] {
  const counts = new Map<string, { count: number; category?: string }>();

  for (const job of jobs) {
    const name = job.company.trim();
    if (!name || /confidential/i.test(name)) {
      continue;
    }
    const existing = counts.get(name);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(name, { count: 1, category: job.category });
    }
  }

  return [...counts.entries()]
    .map(([name, meta]) => ({
      name,
      count: meta.count,
      category: meta.category,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

export function formatForecastMonth(forecastDate: string): string {
  const [year, month] = forecastDate.split("-");
  const y = Number(year);
  const m = Number(month);
  if (!y || !m) {
    return forecastDate;
  }
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

export interface ForecastChartPoint {
  month: string;
  forecast_date: string;
  predicted: number;
  lower: number;
  upper: number;
}

export function buildForecastChartPoints(
  forecasts: JobForecast[],
): ForecastChartPoint[] {
  return [...forecasts]
    .sort((a, b) => a.forecast_date.localeCompare(b.forecast_date))
    .map((f) => {
      const lower = f.lower_bound ?? f.predicted_count;
      const upper = f.upper_bound ?? f.predicted_count;
      return {
        month: formatForecastMonth(f.forecast_date),
        forecast_date: f.forecast_date,
        predicted: Number(f.predicted_count.toFixed(2)),
        lower: Number(lower.toFixed(2)),
        upper: Number(upper.toFixed(2)),
      };
    });
}

export function forecastTrendInsight(
  forecasts: JobForecast[],
  role: string,
): string | null {
  if (!forecasts.length) {
    return null;
  }
  const sorted = [...forecasts].sort((a, b) =>
    a.forecast_date.localeCompare(b.forecast_date),
  );
  if (sorted.length === 1) {
    const month = formatForecastMonth(sorted[0].forecast_date);
    return `${role} is projected at ${sorted[0].predicted_count.toFixed(2)} postings in ${month}.`;
  }
  const first = sorted[0].predicted_count;
  const last = sorted[sorted.length - 1].predicted_count;
  if (first <= 0) {
    return `Forecast shows ${sorted.length} months of projected posting volume for ${role}.`;
  }
  const changePct = ((last - first) / first) * 100;
  const direction =
    changePct > 2 ? "upward" : changePct < -2 ? "downward" : "steady";
  const magnitude = Math.abs(changePct).toFixed(0);
  return `Predicted postings for ${role} trend ${direction} (${changePct >= 0 ? "+" : ""}${magnitude}% across the forecast window).`;
}

function findTrendingRoleName(
  trending: TrendingCareer[],
  title: string | undefined | null,
): string | null {
  const needle = title?.trim().toLowerCase();
  if (!needle) {
    return null;
  }
  const hit = trending.find((t) => {
    const name = t.name.trim().toLowerCase();
    return name === needle || name.includes(needle) || needle.includes(name);
  });
  return hit?.name ?? null;
}

/** Pick initial forecast role from `/api/jobs/trending` results only. */
export function pickDefaultForecastRole(
  trending: TrendingCareer[],
  profileMatches: JobMatch[],
  careerInterest?: string | null,
): string {
  const fromMatch = findTrendingRoleName(
    trending,
    profileMatches[0]?.normalized_title,
  );
  if (fromMatch) {
    return fromMatch;
  }

  const fromInterest = findTrendingRoleName(trending, careerInterest);
  if (fromInterest) {
    return fromInterest;
  }

  return trending[0]?.name?.trim() ?? "";
}

/** Projected posting growth across a single role's forecast window. */
export function computeForecastGrowthPct(
  forecasts: JobForecast[],
): number | null {
  if (!forecasts.length) {
    return null;
  }
  const sorted = [...forecasts].sort((a, b) =>
    a.forecast_date.localeCompare(b.forecast_date),
  );
  const first = sorted[0]?.predicted_count ?? 0;
  const last = sorted[sorted.length - 1]?.predicted_count ?? 0;
  if (first > 0) {
    return ((last - first) / first) * 100;
  }
  return last > 0 ? 100 : 0;
}

/**
 * Rank roles by average projected monthly postings from bulk `/api/jobs/forecasts`.
 */
export function deriveTrendingCareersFromForecasts(
  forecasts: JobForecast[],
  limit?: number,
): TrendingCareer[] {
  const byRole = new Map<string, JobForecast[]>();

  for (const row of forecasts) {
    const title = row.normalized_title?.trim();
    if (!title) {
      continue;
    }
    const bucket = byRole.get(title) ?? [];
    bucket.push(row);
    byRole.set(title, bucket);
  }

  const ranked = [...byRole.entries()]
    .filter(([name]) => name.toLowerCase() !== "other")
    .map(([name, rows]) => {
      const sorted = [...rows].sort((a, b) =>
        a.forecast_date.localeCompare(b.forecast_date),
      );
      const first = sorted[0]?.predicted_count ?? 0;
      const last = sorted[sorted.length - 1]?.predicted_count ?? 0;
      const growth_pct =
        first > 0 ? ((last - first) / first) * 100 : last > 0 ? 100 : 0;
      const avgPostings =
        sorted.reduce((sum, r) => sum + r.predicted_count, 0) / sorted.length;

      return {
        name,
        job_count: Math.round(avgPostings * 10) / 10,
        company_count: 0,
        growth_pct,
      };
    })
    .sort((a, b) => {
      const postsDiff = b.job_count - a.job_count;
      if (postsDiff !== 0) {
        return postsDiff;
      }
      return (b.growth_pct ?? 0) - (a.growth_pct ?? 0);
    });

  return limit != null ? ranked.slice(0, limit) : ranked;
}

export type FutureRoleMonthlyPosting = {
  month: string;
  forecastDate: string;
  predictedCount: number;
};

export type FutureRoleForecastBar = {
  id: string;
  name: string;
  rank: number;
  projectedPosts: number;
  growthPct: number;
  monthCount: number;
  forecastWindow: string;
  monthlyPostings: FutureRoleMonthlyPosting[];
  peakPosts: number;
};

export type ForecastAggregationMeta = {
  monthCount: number;
  forecastWindow: string;
  roleCount: number;
};

/** Shared forecast window + how bar values are computed from monthly API rows. */
export function getForecastAggregationMeta(
  forecasts: JobForecast[],
): ForecastAggregationMeta | null {
  if (!forecasts.length) {
    return null;
  }
  const dates = [
    ...new Set(
      forecasts.map((row) => row.forecast_date).filter(Boolean),
    ),
  ].sort();
  const roles = new Set(
    forecasts
      .map((row) => row.normalized_title?.trim())
      .filter((name) => name && name.toLowerCase() !== "other"),
  );

  return {
    monthCount: dates.length,
    forecastWindow: `${formatForecastMonth(dates[0])} – ${formatForecastMonth(dates[dates.length - 1])}`,
    roleCount: roles.size,
  };
}

function mapRoleForecastRows(rows: JobForecast[]): {
  monthlyPostings: FutureRoleMonthlyPosting[];
  avgPostings: number;
  peakPosts: number;
  growth_pct: number;
} {
  const sorted = [...rows].sort((a, b) =>
    a.forecast_date.localeCompare(b.forecast_date),
  );
  const monthlyPostings = sorted.map((row) => ({
    month: formatForecastMonth(row.forecast_date),
    forecastDate: row.forecast_date,
    predictedCount: row.predicted_count,
  }));
  const first = sorted[0]?.predicted_count ?? 0;
  const last = sorted[sorted.length - 1]?.predicted_count ?? 0;
  const growth_pct =
    first > 0 ? ((last - first) / first) * 100 : last > 0 ? 100 : 0;
  const avgPostings =
    sorted.reduce((sum, row) => sum + row.predicted_count, 0) / sorted.length;
  const peakPosts = Math.max(...sorted.map((row) => row.predicted_count), 0);

  return {
    monthlyPostings,
    avgPostings: Math.round(avgPostings * 10) / 10,
    peakPosts: Math.round(peakPosts * 10) / 10,
    growth_pct,
  };
}

/** Horizontal bar chart rows for new-roadmap future tab (all roles, ranked by volume). */
export function buildFutureRoleForecastBars(
  forecasts: JobForecast[],
): FutureRoleForecastBar[] {
  const meta = getForecastAggregationMeta(forecasts);
  const byRole = new Map<string, JobForecast[]>();

  for (const row of forecasts) {
    const title = row.normalized_title?.trim();
    if (!title || title.toLowerCase() === "other") {
      continue;
    }
    const bucket = byRole.get(title) ?? [];
    bucket.push(row);
    byRole.set(title, bucket);
  }

  const ranked = [...byRole.entries()]
    .map(([name, rows]) => {
      const stats = mapRoleForecastRows(rows);
      return {
        name,
        job_count: stats.avgPostings,
        growth_pct: stats.growth_pct,
        monthCount: stats.monthlyPostings.length,
        forecastWindow: meta?.forecastWindow ?? "",
        monthlyPostings: stats.monthlyPostings,
        peakPosts: stats.peakPosts,
      };
    })
    .sort((a, b) => {
      const postsDiff = b.job_count - a.job_count;
      if (postsDiff !== 0) {
        return postsDiff;
      }
      return (b.growth_pct ?? 0) - (a.growth_pct ?? 0);
    });

  return ranked.map((career, index) => ({
    id: `forecast-${index}-${encodeURIComponent(career.name)}`,
    name: career.name,
    rank: index + 1,
    projectedPosts: career.job_count,
    growthPct: career.growth_pct ?? 0,
    monthCount: career.monthCount,
    forecastWindow: career.forecastWindow,
    monthlyPostings: career.monthlyPostings,
    peakPosts: career.peakPosts,
  }));
}

/** Slice bulk `/api/jobs/forecasts` rows for one role (line chart). */
export function filterForecastsForRole(
  forecasts: JobForecast[],
  roleName: string,
): JobForecast[] {
  const needle = roleName.trim().toLowerCase();
  if (!needle) {
    return [];
  }
  return forecasts.filter(
    (row) => row.normalized_title?.trim().toLowerCase() === needle,
  );
}

export type MarketInsightCard = {
  id: string;
  title: string;
  value: string;
  description: string;
};

/** Snapshot chips for the current-market tab (trending, skills, stats APIs). */
export function buildMarketCurrentInsights(
  trending: TrendingCareer[],
  skills: InDemandSkill[],
  stats: JobStats | null,
  lookbackPhrase: string,
): MarketInsightCard[] {
  const cards: MarketInsightCard[] = [];

  if (stats && stats.total_jobs > 0) {
    cards.push({
      id: "indexed",
      title: "Indexed openings",
      value: formatCompactNumber(stats.total_jobs),
      description: `${formatCompactNumber(stats.unique_companies)} employers · ${stats.unique_categories} role categories tracked.`,
    });
  }

  const top = trending[0];
  if (top) {
    cards.push({
      id: "top-role",
      title: "Highest volume",
      value: top.name,
      description: `${formatCompactNumber(top.job_count)} openings · ${formatCompactNumber(top.company_count)} companies in ${lookbackPhrase}.`,
    });
  }

  const fastestGrowing = [...trending]
    .filter((c) => (c.growth_pct ?? 0) > 0)
    .sort((a, b) => (b.growth_pct ?? 0) - (a.growth_pct ?? 0))[0];

  if (fastestGrowing) {
    const growth = formatGrowthLabel(fastestGrowing.growth_pct);
    cards.push({
      id: "momentum",
      title: "Fastest momentum",
      value: fastestGrowing.name,
      description: `${growth.label} vs prior period in ${lookbackPhrase}.`,
    });
  } else if (skills[0]) {
    cards.push({
      id: "top-skill",
      title: "Top skill signal",
      value: skills[0].skill,
      description: skills[1]
        ? `Often paired with ${skills[1].skill} in live postings.`
        : "Most frequent skill in indexed job listings.",
    });
  }

  return cards.slice(0, 3);
}

/** Snapshot chips for the future-demand tab (bulk forecasts API). */
export function buildMarketFutureInsights(
  bars: FutureRoleForecastBar[],
  meta: ForecastAggregationMeta | null,
  selectedBar: FutureRoleForecastBar | null,
): MarketInsightCard[] {
  const cards: MarketInsightCard[] = [];

  if (meta) {
    cards.push({
      id: "coverage",
      title: "Forecast coverage",
      value: `${meta.roleCount} roles`,
      description: `${meta.monthCount}-month ensemble window (${meta.forecastWindow}).`,
    });
  }

  const leader = bars[0];
  if (leader) {
    cards.push({
      id: "projected-leader",
      title: "Highest projected demand",
      value: leader.name,
      description: `${leader.projectedPosts.toFixed(1)} avg predicted postings/mo · rank #${leader.rank}.`,
    });
  }

  const fastest = [...bars]
    .filter((b) => b.growthPct > 0)
    .sort((a, b) => b.growthPct - a.growthPct)[0];

  if (fastest && fastest.id !== leader?.id) {
    const growth = formatGrowthLabel(fastest.growthPct);
    cards.push({
      id: "projected-growth",
      title: "Strongest projected growth",
      value: fastest.name,
      description: `${growth.label} across the forecast window.`,
    });
  } else if (selectedBar) {
    cards.push({
      id: "selected",
      title: "Selected role",
      value: selectedBar.name,
      description: `Peak ${selectedBar.peakPosts.toFixed(1)} · avg ${selectedBar.projectedPosts.toFixed(1)} postings/mo.`,
    });
  }

  return cards.slice(0, 3);
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
