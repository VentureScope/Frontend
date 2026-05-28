"use client";

import { useCallback, useEffect, useState } from "react";
import { getGithubSyncedData, getLatestTranscript } from "@/lib/auth-api";
import { getUserReadiness } from "@/lib/readiness-api";
import {
  mergeSuggestedActions,
  readinessInsightHeadline,
  suggestedActionsFromReadiness,
} from "@/lib/readiness-insights";
import type { UserReadiness } from "@/types/readiness";
import {
  mapNotificationToActivity,
  pickActiveRoadmap,
  type DashboardActivityItem,
} from "@/lib/dashboard-utils";
import { getInDemandSkills, getTrendingCareers } from "@/lib/jobs-api";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import { getMarketPulseFallbackData } from "@/lib/market-pulse-fallback";
import { setNotificationSummaryCache } from "@/lib/notification-summary-cache";
import { listNotifications } from "@/lib/notifications-api";
import { listRoadmaps } from "@/lib/roadmaps-api";
import { listResumes } from "@/lib/resume-api";
import type { GeneratedResumeOut } from "@/types/generated-resume";
import type { InDemandSkill, TrendingCareer } from "@/types/jobs";
import type { RoadmapListItem } from "@/types/roadmap";

export type DashboardSuggestedAction = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export type DashboardSyncItem = {
  id: string;
  label: string;
  status: "SYNCED" | "PENDING" | "NOT_CONNECTED";
  href: string;
};

export type DashboardOverviewData = {
  readiness: UserReadiness | null;
  readinessScore: number;
  insightHeadline: string;
  activeRoadmap: RoadmapListItem | null;
  latestResume: GeneratedResumeOut | null;
  profileMatchPercent: number | null;
  trendingCareers: TrendingCareer[];
  inDemandSkills: InDemandSkill[];
  activities: DashboardActivityItem[];
  suggestedActions: DashboardSuggestedAction[];
  syncItems: DashboardSyncItem[];
  unreadNotifications: number;
};

const EMPTY: DashboardOverviewData = {
  readiness: null,
  readinessScore: 0,
  insightHeadline:
    "Complete your profile and sync data sources to unlock personalized insights.",
  activeRoadmap: null,
  latestResume: null,
  profileMatchPercent: null,
  trendingCareers: [],
  inDemandSkills: [],
  activities: [],
  suggestedActions: [],
  syncItems: [
    {
      id: "github",
      label: "GitHub Repos",
      status: "NOT_CONNECTED",
      href: "/dashboard/data-hub",
    },
    {
      id: "estudent",
      label: "eStudent Records",
      status: "NOT_CONNECTED",
      href: "/dashboard/data-hub",
    },
  ],
  unreadNotifications: 0,
};

function buildInsightHeadline(
  careerInterest: string,
  readiness: number,
): string {
  if (readiness > 0) {
    return `Your overall learning readiness is ${readiness}%. Continue your active roadmap to improve market fit.`;
  }
  return `You're focused on ${careerInterest}. Generate a roadmap or sync your data hub to unlock AI insights.`;
}

function buildSuggestedActions(
  roadmaps: RoadmapListItem[],
  hasGithub: boolean,
  hasTranscript: boolean,
): DashboardSuggestedAction[] {
  const actions: DashboardSuggestedAction[] = [];

  if (!hasGithub) {
    actions.push({
      id: "sync-github",
      title: "Connect GitHub",
      description:
        "Sync repositories so VentureScope can analyze your engineering profile.",
      href: "/dashboard/data-hub",
    });
  }

  if (!hasTranscript) {
    actions.push({
      id: "sync-transcript",
      title: "Upload academic transcript",
      description:
        "Add eStudent records to strengthen career matching and readiness scoring.",
      href: "/dashboard/data-hub",
    });
  }

  const active = pickActiveRoadmap(roadmaps);
  if (active && (active.completion_percentage ?? 0) < 100) {
    actions.push({
      id: "continue-roadmap",
      title: `Continue: ${active.title}`,
      description: `You're ${Math.round(active.completion_percentage ?? 0)}% through this learning path.`,
      href: `/dashboard/learning-path/${active.id}`,
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: "new-roadmap",
      title: "Create a learning roadmap",
      description:
        "Generate an AI-powered path aligned with your career interest.",
      href: "/dashboard/learning-path/new-roadmap",
    });
  }

  return actions.slice(0, 3);
}

export function useDashboardOverview(careerInterest: string) {
  const { days } = useMarketAnalyticsPeriod();
  const [data, setData] = useState<DashboardOverviewData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCore = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        roadmapsResult,
        resumesResult,
        notificationsResult,
        githubResult,
        transcriptResult,
        readinessResult,
      ] = await Promise.allSettled([
        listRoadmaps(),
        listResumes(),
        listNotifications({ per_page: 5, page: 1 }),
        getGithubSyncedData(),
        getLatestTranscript(),
        getUserReadiness(),
      ]);

      const roadmaps =
        roadmapsResult.status === "fulfilled" ? roadmapsResult.value : [];
      const resumes =
        resumesResult.status === "fulfilled" ? resumesResult.value : [];
      const notifications =
        notificationsResult.status === "fulfilled"
          ? notificationsResult.value
          : { notifications: [], total_count: 0, unread_count: 0 };
      const readiness =
        readinessResult.status === "fulfilled" ? readinessResult.value : null;
      const readinessScore = readiness?.overall_score ?? 0;
      const activeRoadmap = pickActiveRoadmap(roadmaps);
      const latestResume =
        resumes.length > 0
          ? [...resumes].sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )[0]
          : null;

      const hasGithub =
        githubResult.status === "fulfilled" &&
        (githubResult.value.repositories?.length ?? 0) > 0;
      const hasTranscript = transcriptResult.status === "fulfilled";

      const syncItems: DashboardSyncItem[] = [
        {
          id: "github",
          label: "GitHub Repos",
          status: hasGithub ? "SYNCED" : "NOT_CONNECTED",
          href: "/dashboard/data-hub",
        },
        {
          id: "estudent",
          label: "eStudent Records",
          status: hasTranscript ? "SYNCED" : "NOT_CONNECTED",
          href: "/dashboard/data-hub",
        },
      ];

      const activities =
        notifications.notifications.length > 0
          ? notifications.notifications.map(mapNotificationToActivity)
          : [];

      setNotificationSummaryCache(notifications.unread_count);

      const fallbackHeadline = buildInsightHeadline(
        careerInterest,
        readinessScore,
      );

      setData((prev) => ({
        ...prev,
        readiness,
        readinessScore,
        insightHeadline: readinessInsightHeadline(
          readiness,
          fallbackHeadline,
        ),
        activeRoadmap,
        latestResume,
        profileMatchPercent: null,
        activities,
        suggestedActions: mergeSuggestedActions(
          suggestedActionsFromReadiness(readiness),
          buildSuggestedActions(roadmaps, hasGithub, hasTranscript),
        ),
        syncItems,
        unreadNotifications: notifications.unread_count,
      }));
    } catch {
      setError("Could not load dashboard overview.");
      setData((prev) => ({
        ...prev,
        insightHeadline: buildInsightHeadline(careerInterest, 0),
      }));
    } finally {
      setLoading(false);
    }
  }, [careerInterest]);

  const loadMarket = useCallback(async () => {
    setMarketLoading(true);
    const fallback = getMarketPulseFallbackData();

    try {
      const [trendingResult, skillsResult] = await Promise.allSettled([
        getTrendingCareers({ limit: 7, period: days }),
        getInDemandSkills({ limit: 6, period: days }),
      ]);

      const trendingCareers =
        trendingResult.status === "fulfilled" && trendingResult.value.length > 0
          ? trendingResult.value
          : fallback.trending;
      const inDemandSkills =
        skillsResult.status === "fulfilled" && skillsResult.value.length > 0
          ? skillsResult.value
          : fallback.skills;

      setData((prev) => ({
        ...prev,
        trendingCareers,
        inDemandSkills,
      }));
    } catch {
      setData((prev) => ({
        ...prev,
        trendingCareers: fallback.trending,
        inDemandSkills: fallback.skills,
      }));
    } finally {
      setMarketLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void loadCore();
  }, [loadCore]);

  useEffect(() => {
    void loadMarket();
  }, [loadMarket]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      insightHeadline: readinessInsightHeadline(
        prev.readiness,
        buildInsightHeadline(careerInterest, prev.readinessScore),
      ),
    }));
  }, [careerInterest]);

  const reload = useCallback(async () => {
    await Promise.all([loadCore(), loadMarket()]);
  }, [loadCore, loadMarket]);

  const refreshReadiness = useCallback(async () => {
    try {
      const readiness = await getUserReadiness({ refresh: true });
      setData((prev) => ({
        ...prev,
        readiness,
        readinessScore: readiness.overall_score,
        insightHeadline: readinessInsightHeadline(
          readiness,
          prev.insightHeadline,
        ),
        suggestedActions: mergeSuggestedActions(
          suggestedActionsFromReadiness(readiness),
          prev.suggestedActions.filter((a) => !a.id.startsWith("readiness-")),
        ),
      }));
    } catch {
      // Keep existing readiness on refresh failure
    }
  }, []);

  return {
    data,
    loading: loading || marketLoading,
    error,
    reload,
    refreshReadiness,
  };
}
