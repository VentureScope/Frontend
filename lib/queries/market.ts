import {
  getFutureTrendingRolesForRoadmap,
  getJobForecasts,
  getTrendingCareers,
} from "@/lib/jobs-api";
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
