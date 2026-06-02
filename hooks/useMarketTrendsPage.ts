"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import { useTrendingCareersQuery } from "@/hooks/queries/use-trending-careers-query";
import { useInDemandSkillsQuery } from "@/hooks/queries/use-in-demand-skills-query";
import { useJobStatsQuery } from "@/hooks/queries/use-job-stats-query";
import { useJobForecastsQuery } from "@/hooks/queries/use-job-forecasts-query";
import { useTopHiringCompaniesQuery } from "@/hooks/queries/use-top-hiring-companies-query";
import {
  MARKET_TRENDS_CURRENT_TAB,
  MARKET_TRENDS_FUTURE_TAB,
} from "@/lib/market-trends-tabs";
import {
  buildFutureRoleForecastBars,
  buildMarketCurrentInsights,
  buildMarketFutureInsights,
  getForecastAggregationMeta,
  MARKET_TOP_K,
} from "@/lib/job-market-insights";
import { MARKET_TRENDS_TRENDING_LIMIT } from "@/lib/queries/constants";
import { useAppStore } from "@/store/useAppStore";

function findDefaultForecastBarId(
  bars: ReturnType<typeof buildFutureRoleForecastBars>,
  careerInterest: string | null,
): string {
  if (bars.length === 0) {
    return "";
  }
  if (careerInterest) {
    const needle = careerInterest.trim().toLowerCase();
    const match = bars.find(
      (bar) =>
        bar.name.trim().toLowerCase() === needle ||
        bar.name.trim().toLowerCase().includes(needle) ||
        needle.includes(bar.name.trim().toLowerCase()),
    );
    if (match) {
      return match.id;
    }
  }
  return bars[0].id;
}

export function useMarketTrendsPage() {
  const { days, lookbackPhrase, label: periodLabel } = useMarketAnalyticsPeriod();
  const careerInterest = useAppStore(
    (s) => s.authData.user?.career_interest ?? null,
  );

  const [activeTab, setActiveTab] = useState(MARKET_TRENDS_FUTURE_TAB);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const trendingQuery = useTrendingCareersQuery(days, MARKET_TRENDS_TRENDING_LIMIT);
  const skillsQuery = useInDemandSkillsQuery(days, MARKET_TOP_K.skills);
  const statsQuery = useJobStatsQuery(days);
  const forecastsQuery = useJobForecastsQuery();

  const companyCategories = useMemo(
    () =>
      (trendingQuery.data ?? [])
        .slice(0, 3)
        .map((c) => c.name.trim())
        .filter(Boolean),
    [trendingQuery.data],
  );

  const companiesQuery = useTopHiringCompaniesQuery(days, companyCategories, {
    enabled: activeTab === MARKET_TRENDS_CURRENT_TAB,
  });

  const forecasts = useMemo(
    () => forecastsQuery.data ?? [],
    [forecastsQuery.data],
  );

  const forecastBars = useMemo(
    () => buildFutureRoleForecastBars(forecasts),
    [forecasts],
  );

  const forecastMeta = useMemo(
    () => getForecastAggregationMeta(forecasts),
    [forecasts],
  );

  useEffect(() => {
    if (forecastBars.length === 0) {
      setSelectedRoleId("");
      return;
    }
    setSelectedRoleId((prev) => {
      if (prev && forecastBars.some((bar) => bar.id === prev)) {
        return prev;
      }
      return findDefaultForecastBarId(forecastBars, careerInterest);
    });
  }, [forecastBars, careerInterest]);

  const selectedBar = useMemo(
    () => forecastBars.find((bar) => bar.id === selectedRoleId) ?? null,
    [forecastBars, selectedRoleId],
  );

  const currentInsights = useMemo(
    () =>
      buildMarketCurrentInsights(
        trendingQuery.data ?? [],
        skillsQuery.data ?? [],
        statsQuery.data ?? null,
        lookbackPhrase,
      ),
    [trendingQuery.data, skillsQuery.data, statsQuery.data, lookbackPhrase],
  );

  const futureInsights = useMemo(
    () =>
      buildMarketFutureInsights(forecastBars, forecastMeta, selectedBar),
    [forecastBars, forecastMeta, selectedBar],
  );

  const isRefetching =
    (activeTab === MARKET_TRENDS_CURRENT_TAB &&
      (statsQuery.isFetching ||
        skillsQuery.isFetching ||
        trendingQuery.isFetching ||
        companiesQuery.isFetching)) ||
    (activeTab === MARKET_TRENDS_FUTURE_TAB && forecastsQuery.isFetching);

  const updatedAt = useMemo(() => {
    const times =
      activeTab === MARKET_TRENDS_FUTURE_TAB
        ? [forecastsQuery.dataUpdatedAt]
        : [
            statsQuery.dataUpdatedAt,
            skillsQuery.dataUpdatedAt,
            trendingQuery.dataUpdatedAt,
            companiesQuery.dataUpdatedAt,
          ];
    const valid = times.filter((t) => t > 0);
    return valid.length > 0 ? Math.max(...valid) : null;
  }, [
    activeTab,
    forecastsQuery.dataUpdatedAt,
    statsQuery.dataUpdatedAt,
    skillsQuery.dataUpdatedAt,
    trendingQuery.dataUpdatedAt,
    companiesQuery.dataUpdatedAt,
  ]);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === MARKET_TRENDS_FUTURE_TAB && !selectedRoleId && forecastBars[0]) {
        setSelectedRoleId(findDefaultForecastBarId(forecastBars, careerInterest));
      }
    },
    [careerInterest, forecastBars, selectedRoleId],
  );

  const retryForecasts = useCallback(
    () => void forecastsQuery.refetch(),
    [forecastsQuery],
  );
  const retryStats = useCallback(() => void statsQuery.refetch(), [statsQuery]);
  const retrySkills = useCallback(() => void skillsQuery.refetch(), [skillsQuery]);
  const retryTrending = useCallback(
    () => void trendingQuery.refetch(),
    [trendingQuery],
  );
  const retryCompanies = useCallback(
    () => void companiesQuery.refetch(),
    [companiesQuery],
  );

  return {
    activeTab,
    handleTabChange,
    days,
    lookbackPhrase,
    periodLabel,
    careerInterest,
    trending: trendingQuery.data ?? [],
    skills: skillsQuery.data ?? [],
    topCompanies: companiesQuery.data ?? [],
    companyCategories,
    forecasts,
    forecastBars,
    forecastMeta,
    selectedRoleId,
    setSelectedRoleId,
    selectedBar,
    currentInsights,
    futureInsights,
    loading: {
      current:
        trendingQuery.isPending || skillsQuery.isPending || statsQuery.isPending,
      trending: trendingQuery.isPending,
      skills: skillsQuery.isPending,
      companies:
        trendingQuery.isPending ||
        (companyCategories.length > 0 && companiesQuery.isPending),
      future: forecastsQuery.isPending,
    },
    errors: {
      trending: trendingQuery.isError,
      skills: skillsQuery.isError,
      companies: companiesQuery.isError,
      future: forecastsQuery.isError,
    },
    isRefetching,
    updatedAt,
    retryForecasts,
    retryStats,
    retrySkills,
    retryTrending,
    retryCompanies,
  };
}
