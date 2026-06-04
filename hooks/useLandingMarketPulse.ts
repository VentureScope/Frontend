"use client";

import { useInDemandSkillsQuery } from "@/hooks/queries/use-in-demand-skills-query";
import { useJobStatsQuery } from "@/hooks/queries/use-job-stats-query";
import { useTrendingCareersQuery } from "@/hooks/queries/use-trending-careers-query";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import { MARKET_TOP_K } from "@/lib/job-market-insights";
import { MARKET_ALL_TIME_DAYS } from "@/lib/market-analytics-period";
import { getMarketPulseFallbackData } from "@/lib/market-pulse-fallback";
import type { InDemandSkill, JobStats, TrendingCareer } from "@/types/jobs";

type UseLandingMarketPulseOptions = {
  /** Fetch in-demand skills (about + market-insight). */
  includeSkills?: boolean;
  /** Fetch trending careers (home + market-insight). */
  includeTrending?: boolean;
  /** Fetch corpus-wide stats for all-time totals (market-insight). */
  includeAllTimeStats?: boolean;
  /** Fetch period job stats (all landing market surfaces). */
  includeStats?: boolean;
};

/**
 * Shared live market fetch for landing, about, and market-insight pages.
 * Uses TanStack Query so navigation reuses cached data within staleTime (60s).
 * Each page opts into only the slices it displays.
 */
export function useLandingMarketPulse(
  options: UseLandingMarketPulseOptions = {},
) {
  const {
    includeSkills = true,
    includeTrending = true,
    includeAllTimeStats = false,
    includeStats = true,
  } = options;
  const { days, lookbackPhrase } = useMarketAnalyticsPeriod();
  const fallback = getMarketPulseFallbackData();

  const skillsQuery = useInDemandSkillsQuery(days, MARKET_TOP_K.skills, {
    enabled: includeSkills,
    keepPreviousData: true,
  });
  const trendingQuery = useTrendingCareersQuery(days, MARKET_TOP_K.trending, {
    enabled: includeTrending,
    keepPreviousData: true,
  });
  const statsQuery = useJobStatsQuery(days, {
    enabled: includeStats,
    keepPreviousData: true,
  });
  const allTimeStatsQuery = useJobStatsQuery(MARKET_ALL_TIME_DAYS, {
    enabled: includeAllTimeStats,
    keepPreviousData: true,
  });

  const skills: InDemandSkill[] = !includeSkills
    ? []
    : skillsQuery.data && skillsQuery.data.length > 0
      ? skillsQuery.data
      : skillsQuery.isError
        ? fallback.skills
        : (skillsQuery.data ?? []);

  const trending: TrendingCareer[] = !includeTrending
    ? []
    : trendingQuery.data && trendingQuery.data.length > 0
      ? trendingQuery.data
      : trendingQuery.isError
        ? fallback.trending
        : (trendingQuery.data ?? []);

  const stats: JobStats | null = !includeStats
    ? null
    : statsQuery.isError
      ? fallback.stats
      : (statsQuery.data ?? null);

  const allTimeStats: JobStats | null = allTimeStatsQuery.isError
    ? null
    : (allTimeStatsQuery.data ?? null);

  const loading =
    (includeSkills && skillsQuery.isPending) ||
    (includeStats && statsQuery.isPending) ||
    (includeTrending && trendingQuery.isPending) ||
    (includeAllTimeStats && allTimeStatsQuery.isPending);

  const isRefetching =
    (includeSkills && skillsQuery.isFetching) ||
    (includeStats && statsQuery.isFetching) ||
    (includeTrending && trendingQuery.isFetching) ||
    (includeAllTimeStats && allTimeStatsQuery.isFetching);

  const usingFallback =
    (includeSkills && skillsQuery.isError) ||
    (includeStats && statsQuery.isError) ||
    (includeTrending && trendingQuery.isError);

  const updatedAt = Math.max(
    includeSkills ? skillsQuery.dataUpdatedAt : 0,
    includeStats ? statsQuery.dataUpdatedAt : 0,
    includeTrending ? trendingQuery.dataUpdatedAt : 0,
    includeAllTimeStats ? allTimeStatsQuery.dataUpdatedAt : 0,
  );

  return {
    days,
    lookbackPhrase,
    skills,
    trending,
    stats,
    allTimeStats,
    loading,
    isRefetching,
    usingFallback,
    hasError: usingFallback && !loading,
    updatedAt: updatedAt > 0 ? updatedAt : null,
  };
}
