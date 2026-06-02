import api from "@/lib/api";
import { deriveTrendingCareersFromForecasts } from "@/lib/job-market-insights";
import type {
  InDemandSkill,
  JobByCategoryRow,
  JobForecast,
  JobStats,
  TrendingCareer,
} from "@/types/jobs";

/** Market-wide trending careers (landing / market insight). */
export async function getTrendingCareers(params?: {
  period?: number;
  limit?: number;
}): Promise<TrendingCareer[]> {
  const res = await api.get<TrendingCareer[]>("/api/jobs/trending", { params });
  return res.data;
}

/** Current trending roles for learning-path & roadmap generation. */
export async function getCurrentTrendingRoles(params?: {
  period?: number;
  limit?: number;
}): Promise<TrendingCareer[]> {
  return getTrendingCareers(params);
}

/** Future predicted roles (dedicated route; may 404 until backend ships). */
export async function getFutureTrendingRoles(params?: {
  limit?: number;
}): Promise<TrendingCareer[]> {
  const res = await api.get<TrendingCareer[]>("/api/jobs/trending/future", {
    params,
  });
  return res.data;
}

/**
 * Roles projected to trend — one bulk `GET /api/jobs/forecasts` (all roles),
 * ranked by average projected monthly postings.
 */
export async function getFutureTrendingRolesForRoadmap(params?: {
  limit?: number;
}): Promise<TrendingCareer[]> {
  const limit = params?.limit ?? 12;

  try {
    const forecasts = await getJobForecasts();
    const derived = deriveTrendingCareersFromForecasts(forecasts, limit);
    if (derived.length > 0) {
      return derived;
    }
  } catch {
    // fall through to legacy endpoint
  }

  try {
    return await getFutureTrendingRoles({ limit });
  } catch {
    return [];
  }
}

export async function getInDemandSkills(params?: {
  limit?: number;
  period?: number;
}): Promise<InDemandSkill[]> {
  const res = await api.get<InDemandSkill[]>("/api/jobs/in-demand-skills", {
    params,
  });
  return res.data;
}

/** Job corpus stats for a lookback window (`period` days; API default 90). */
export async function getJobStats(options?: {
  period?: number;
}): Promise<JobStats> {
  const res = await api.get<JobStats>("/api/jobs/stats", {
    params:
      options?.period != null ? { period: options.period } : undefined,
  });
  return res.data;
}

export async function getJobsByCategory(params: {
  category: string;
  limit?: number;
  offset?: number;
}): Promise<JobByCategoryRow[]> {
  const res = await api.get<JobByCategoryRow[]>("/api/jobs/by-category", {
    params,
  });
  return res.data;
}

/** AI demand forecasts for a normalized role title (e.g. Software Engineer). */
export async function getJobForecasts(params?: {
  role?: string;
}): Promise<JobForecast[]> {
  const res = await api.get<JobForecast[]>("/api/jobs/forecasts", { params });
  return res.data;
}
