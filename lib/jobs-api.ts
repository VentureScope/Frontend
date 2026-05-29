import api from "@/lib/api";
import { computeForecastGrowthPct } from "@/lib/job-market-insights";
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
 * Roles projected to trend in the future — uses the same market-trends APIs as
 * `/dashboard/market-trends`: trending roles plus per-role `/api/jobs/forecasts`.
 */
export async function getFutureTrendingRolesForRoadmap(params?: {
  limit?: number;
  period?: number;
}): Promise<TrendingCareer[]> {
  const limit = params?.limit ?? 12;

  const trending = await getTrendingCareers({
    limit: Math.max(limit, 12),
    period: params?.period ?? 90,
  }).catch(() => [] as TrendingCareer[]);

  if (trending.length === 0) {
    try {
      const dedicated = await getFutureTrendingRoles({ limit });
      if (dedicated.length > 0) {
        return dedicated;
      }
    } catch {
      // no dedicated endpoint
    }
    return [];
  }

  const forecastGrowthByRole = new Map<string, number>();
  await Promise.all(
    trending.map(async (career) => {
      const rows = await getJobForecasts({ role: career.name }).catch(
        () => [] as JobForecast[],
      );
      const growth = computeForecastGrowthPct(rows);
      if (growth !== null) {
        forecastGrowthByRole.set(career.name.trim().toLowerCase(), growth);
      }
    }),
  );

  const merged = trending.map((career) => {
    const key = career.name.trim().toLowerCase();
    const forecastGrowth = forecastGrowthByRole.get(key);
    return {
      ...career,
      growth_pct:
        forecastGrowth !== undefined
          ? forecastGrowth
          : (career.growth_pct ?? 0),
    };
  });

  return [...merged]
    .sort((a, b) => {
      const aKey = a.name.trim().toLowerCase();
      const bKey = b.name.trim().toLowerCase();
      const aHasForecast = forecastGrowthByRole.has(aKey);
      const bHasForecast = forecastGrowthByRole.has(bKey);
      if (aHasForecast !== bHasForecast) {
        return aHasForecast ? -1 : 1;
      }
      const growthDiff = (b.growth_pct ?? 0) - (a.growth_pct ?? 0);
      if (growthDiff !== 0) {
        return growthDiff;
      }
      return b.job_count - a.job_count;
    })
    .slice(0, limit);
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

export async function getJobStats(params?: {
  period?: number;
}): Promise<JobStats> {
  const res = await api.get<JobStats>("/api/jobs/stats", { params });
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
