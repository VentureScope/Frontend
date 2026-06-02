"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useJobForecastsQuery } from "@/hooks/queries/use-job-forecasts-query";
import { useTrendingCareersQuery } from "@/hooks/queries/use-trending-careers-query";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import { ROADMAP_ROLE_PICKER_LIMIT } from "@/lib/queries/constants";
import {
  buildFutureRoleForecastBars,
  getForecastAggregationMeta,
} from "@/lib/job-market-insights";
import { generateRoadmap } from "@/lib/roadmaps-api";
import { mapTrendingToRoleRows } from "@/lib/trending-role-rows";
import { queryKeys } from "@/lib/query-keys";

export function useNewRoadmapPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { days, lookbackPhrase } = useMarketAnalyticsPeriod();
  const limit = ROADMAP_ROLE_PICKER_LIMIT;

  const [activeTab, setActiveTab] = useState("current");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQuery = useTrendingCareersQuery(days, limit);
  const forecastsQuery = useJobForecastsQuery({
    enabled: activeTab === "future",
  });

  const currentRoles = useMemo(
    () =>
      mapTrendingToRoleRows(
        currentQuery.data ?? [],
        "current",
        lookbackPhrase,
      ),
    [currentQuery.data, lookbackPhrase],
  );

  const futureForecastBars = useMemo(
    () => buildFutureRoleForecastBars(forecastsQuery.data ?? []),
    [forecastsQuery.data],
  );

  const forecastMeta = useMemo(
    () => getForecastAggregationMeta(forecastsQuery.data ?? []),
    [forecastsQuery.data],
  );

  useEffect(() => {
    if (currentQuery.isError) {
      toast.error("Could not load current trending roles.");
    }
  }, [currentQuery.isError]);

  useEffect(() => {
    if (forecastsQuery.isError) {
      toast.error("Could not load forecast-based role predictions.");
    }
  }, [forecastsQuery.isError]);

  useEffect(() => {
    if (selectedRoleId) {
      return;
    }
    if (currentRoles[0]) {
      setSelectedRoleId(currentRoles[0].id);
    }
  }, [currentRoles, selectedRoleId]);

  useEffect(() => {
    if (activeTab !== "future" || selectedRoleId || !futureForecastBars[0]) {
      return;
    }
    setSelectedRoleId(futureForecastBars[0].id);
  }, [activeTab, futureForecastBars, selectedRoleId]);

  const displayedRoles = currentRoles;
  const selectedTrendName =
    activeTab === "future"
      ? futureForecastBars.find((bar) => bar.id === selectedRoleId)?.name
      : currentRoles.find((role) => role.id === selectedRoleId)?.trendName;

  const loadingCurrent =
    currentQuery.isPending && currentRoles.length === 0;
  const loadingFuture =
    activeTab === "future" &&
    forecastsQuery.isPending &&
    futureForecastBars.length === 0;

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === "current") {
        if (currentRoles.length === 0) {
          return;
        }
        const stillVisible = currentRoles.some((r) => r.id === selectedRoleId);
        if (!stillVisible) {
          setSelectedRoleId(currentRoles[0].id);
        }
        return;
      }

      if (futureForecastBars.length === 0) {
        return;
      }
      const stillVisible = futureForecastBars.some(
        (bar) => bar.id === selectedRoleId,
      );
      if (!stillVisible) {
        setSelectedRoleId(futureForecastBars[0].id);
      }
    },
    [currentRoles, futureForecastBars, selectedRoleId],
  );

  const handleGenerate = useCallback(async () => {
    if (!selectedTrendName) {
      toast.error("Select a role first.");
      return;
    }
    setIsGenerating(true);
    try {
      const roadmap = await generateRoadmap({
        trend_name: selectedTrendName,
        goal: `Build skills to grow as a ${selectedTrendName}`,
        use_market_trends: activeTab === "current",
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.roadmaps.list(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.roadmaps.detail(roadmap.id),
      });
      toast.success("Roadmap created.");
      router.push(`/dashboard/learning-path/${roadmap.id}`);
    } catch {
      toast.error("Could not generate roadmap.");
    } finally {
      setIsGenerating(false);
    }
  }, [activeTab, queryClient, router, selectedTrendName]);

  return {
    activeTab,
    selectedRoleId,
    setSelectedRoleId,
    displayedRoles: currentRoles,
    futureForecastBars,
    forecastMeta,
    loadingCurrent,
    loadingFuture,
    isEmpty:
      activeTab === "current"
        ? !loadingCurrent && currentQuery.isSuccess && currentRoles.length === 0
        : !loadingFuture &&
          forecastsQuery.isSuccess &&
          futureForecastBars.length === 0,
    isGenerating,
    handleTabChange,
    handleGenerate,
  };
}
