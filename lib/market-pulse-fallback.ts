import type { InDemandSkill, JobStats, TrendingCareer } from "@/types/jobs";

/** Shown on the home page when live job APIs are unavailable. */
export const MARKET_PULSE_FALLBACK_SKILLS: InDemandSkill[] = [
  { skill: "Python", demand: 94 },
  { skill: "React / Next.js", demand: 88 },
  { skill: "Cloud (AWS)", demand: 81 },
  { skill: "SQL & Data", demand: 76 },
  { skill: "TypeScript", demand: 72 },
];

export const MARKET_PULSE_FALLBACK_TRENDING: TrendingCareer[] = [
  { name: "Software Engineer", job_count: 2840, company_count: 210 },
  { name: "Full Stack Developer", job_count: 1920, company_count: 165 },
  { name: "Data Analyst", job_count: 1180, company_count: 98 },
];

export const MARKET_PULSE_FALLBACK_STATS: JobStats = {
  total_jobs: 12840,
  unique_companies: 920,
  unique_categories: 28,
};

export function getMarketPulseFallbackData(): {
  skills: InDemandSkill[];
  trending: TrendingCareer[];
  stats: JobStats;
} {
  return {
    skills: MARKET_PULSE_FALLBACK_SKILLS,
    trending: MARKET_PULSE_FALLBACK_TRENDING,
    stats: MARKET_PULSE_FALLBACK_STATS,
  };
}
