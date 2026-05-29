"use client";

import { useCallback, useMemo } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
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
import { useNotificationsActivityQuery } from "@/hooks/queries/use-notifications-activity-query";
import { getMarketPulseFallbackData } from "@/lib/market-pulse-fallback";
import { queryKeys } from "@/lib/query-keys";
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

const ACTIVITY_NOTIFICATION_LIMIT = 5;

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
  const queryClient = useQueryClient();
  const fallback = getMarketPulseFallbackData();

  const notificationsQuery = useNotificationsActivityQuery();

  const [roadmapsQuery, resumesQuery, githubQuery, transcriptQuery, readinessQuery] =
    useQueries({
      queries: [
        {
          queryKey: queryKeys.roadmaps.list(),
          queryFn: listRoadmaps,
        },
        {
          queryKey: queryKeys.resumes.list(),
          queryFn: listResumes,
        },
        {
          queryKey: queryKeys.profile.github(),
          queryFn: getGithubSyncedData,
        },
        {
          queryKey: queryKeys.profile.transcriptLatest(),
          queryFn: getLatestTranscript,
        },
        {
          queryKey: queryKeys.readiness.user(),
          queryFn: () => getUserReadiness(),
        },
      ],
    });

  const marketQuery = useQueries({
    queries: [
      {
        queryKey: queryKeys.market.trending(days, 7),
        queryFn: () => getTrendingCareers({ limit: 7, period: days }),
      },
      {
        queryKey: queryKeys.market.inDemandSkills(days, 6),
        queryFn: () => getInDemandSkills({ limit: 6, period: days }),
      },
    ],
  });

  const [trendingQuery, skillsQuery] = marketQuery;

  const corePending =
    roadmapsQuery.isPending ||
    resumesQuery.isPending ||
    notificationsQuery.isPending ||
    githubQuery.isPending ||
    transcriptQuery.isPending ||
    readinessQuery.isPending;

  const marketPending = trendingQuery.isPending || skillsQuery.isPending;

  const coreError =
    roadmapsQuery.error ||
    resumesQuery.error ||
    notificationsQuery.error ||
    githubQuery.error ||
    transcriptQuery.error ||
    readinessQuery.error;

  const data = useMemo((): DashboardOverviewData => {
    const roadmaps = roadmapsQuery.data ?? [];
    const resumes = resumesQuery.data ?? [];
    const notifications = notificationsQuery.data ?? {
      notifications: [],
      total_count: 0,
      unread_count: 0,
    };
    const readiness = readinessQuery.data ?? null;
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

    const hasGithub = (githubQuery.data?.repositories?.length ?? 0) > 0;
    const hasTranscript = transcriptQuery.isSuccess;

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

    const activityItems = notifications.notifications.slice(
      0,
      ACTIVITY_NOTIFICATION_LIMIT,
    );
    const activities =
      activityItems.length > 0
        ? activityItems.map(mapNotificationToActivity)
        : [];

    const trendingCareers =
      trendingQuery.data && trendingQuery.data.length > 0
        ? trendingQuery.data
        : fallback.trending;
    const inDemandSkills =
      skillsQuery.data && skillsQuery.data.length > 0
        ? skillsQuery.data
        : fallback.skills;

    const fallbackHeadline = buildInsightHeadline(
      careerInterest,
      readinessScore,
    );

    return {
      readiness,
      readinessScore,
      insightHeadline: readinessInsightHeadline(
        readiness,
        fallbackHeadline,
      ),
      activeRoadmap,
      latestResume,
      profileMatchPercent: null,
      trendingCareers,
      inDemandSkills,
      activities,
      suggestedActions: mergeSuggestedActions(
        suggestedActionsFromReadiness(readiness),
        buildSuggestedActions(roadmaps, hasGithub, hasTranscript),
      ),
      syncItems,
      unreadNotifications: notifications.unread_count,
    };
  }, [
    roadmapsQuery.data,
    resumesQuery.data,
    notificationsQuery.data,
    githubQuery.data,
    githubQuery.isSuccess,
    transcriptQuery.isSuccess,
    readinessQuery.data,
    trendingQuery.data,
    skillsQuery.data,
    careerInterest,
    fallback.trending,
    fallback.skills,
  ]);

  const reload = useCallback(async () => {
    await Promise.all([
      roadmapsQuery.refetch(),
      resumesQuery.refetch(),
      notificationsQuery.refetch(),
      githubQuery.refetch(),
      transcriptQuery.refetch(),
      readinessQuery.refetch(),
      trendingQuery.refetch(),
      skillsQuery.refetch(),
    ]);
  }, [
    roadmapsQuery,
    resumesQuery,
    notificationsQuery,
    githubQuery,
    transcriptQuery,
    readinessQuery,
    trendingQuery,
    skillsQuery,
  ]);

  const refreshReadiness = useCallback(async () => {
    try {
      const readiness = await getUserReadiness({ refresh: true });
      queryClient.setQueryData(queryKeys.readiness.user(), readiness);
    } catch {
      // Keep existing readiness on refresh failure
    }
  }, [queryClient]);

  const hasAnyCoreData =
    roadmapsQuery.isSuccess ||
    resumesQuery.isSuccess ||
    notificationsQuery.isSuccess;

  return {
    data,
    loading: corePending || marketPending,
    error:
      !hasAnyCoreData && !corePending && coreError
        ? "Could not load dashboard overview."
        : null,
    reload,
    refreshReadiness,
  };
}
