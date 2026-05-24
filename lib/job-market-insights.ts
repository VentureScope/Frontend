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

export function pickDefaultForecastRole(
  trending: TrendingCareer[],
  profileMatches: JobMatch[],
  careerInterest?: string | null,
): string {
  const matchTitle = profileMatches[0]?.normalized_title?.trim();
  if (matchTitle) {
    return matchTitle;
  }

  const interest = careerInterest?.trim().toLowerCase();
  if (interest) {
    const fromInterest = trending.find(
      (t) =>
        t.name.toLowerCase().includes(interest) ||
        interest.includes(t.name.toLowerCase()),
    );
    if (fromInterest) {
      return fromInterest.name;
    }
  }

  if (trending[0]?.name) {
    return trending[0].name;
  }

  return "Software Engineer";
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
 * Rank roles by projected posting growth from `/api/jobs/forecasts` (all roles when unfiltered).
 */
export function deriveTrendingCareersFromForecasts(
  forecasts: JobForecast[],
  limit = 12,
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
        job_count: Math.max(1, Math.round(avgPostings)),
        company_count: 0,
        growth_pct,
      };
    })
    .sort((a, b) => (b.growth_pct ?? 0) - (a.growth_pct ?? 0));

  return ranked.slice(0, limit);
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
