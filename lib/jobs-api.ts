import api from "@/lib/api";
import type {
  InDemandSkill,
  JobByCategoryRow,
  JobMatch,
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
  const res = await api.get<TrendingCareer[]>("/api/jobs/trending", {
    params: { period: 30, ...params },
  });
  return res.data;
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

export async function getInDemandSkills(params?: {
  limit?: number;
}): Promise<InDemandSkill[]> {
  const res = await api.get<InDemandSkill[]>("/api/jobs/in-demand-skills", {
    params,
  });
  return res.data;
}

export async function getJobStats(): Promise<JobStats> {
  const res = await api.get<JobStats>("/api/jobs/stats");
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

export async function getJobProfileMatches(params?: {
  limit?: number;
}): Promise<JobMatch[]> {
  const res = await api.get<JobMatch[]>("/api/jobs/match-profile", { params });
  return res.data;
}
