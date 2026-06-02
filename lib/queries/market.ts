import {
  getFutureTrendingRolesForRoadmap,
  getInDemandSkills,
  getJobForecasts,
  getJobStats,
  getJobsByCategory,
  getTrendingCareers,
} from "@/lib/jobs-api";
import {
  aggregateTopHiringCompanies,
  MARKET_TOP_K,
  parseCategoryJob,
  type HiringCompanyRow,
} from "@/lib/job-market-insights";
import type { TrendingCareer } from "@/types/jobs";

export async function fetchTrendingCareers(
  days: number,
  limit: number,
): Promise<TrendingCareer[]> {
  return getTrendingCareers({ period: days, limit });
}

export async function fetchFutureRoadmapRoles(
  limit: number,
): Promise<TrendingCareer[]> {
  return getFutureTrendingRolesForRoadmap({ limit });
}

export async function fetchJobForecasts() {
  return getJobForecasts();
}

export async function fetchJobForecastsForRole(role: string) {
  return getJobForecasts({ role });
}

export async function fetchInDemandSkills(days: number, limit: number) {
  return getInDemandSkills({ limit, period: days });
}

export async function fetchJobStats(period: number) {
  return getJobStats({ period });
}

export async function fetchTopHiringCompanies(
  categories: string[],
): Promise<HiringCompanyRow[]> {
  if (categories.length === 0) {
    return [];
  }

  const batches = await Promise.all(
    categories.map((category) =>
      getJobsByCategory({ category, limit: 40 }).catch(() => []),
    ),
  );

  const parsed = batches.flatMap((rows, batchIndex) =>
    rows.map((row, i) => parseCategoryJob(row, batchIndex * 100 + i)),
  );

  return aggregateTopHiringCompanies(parsed, MARKET_TOP_K.hiringCompanies);
}
