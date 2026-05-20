"use client";

import { useCallback, useEffect, useState } from "react";
import { getGithubSyncedData, getLatestTranscript } from "@/lib/auth-api";
import {
  computeReadinessScore,
  jobMatchToPercent,
  mapNotificationToActivity,
  pickActiveRoadmap,
  type DashboardActivityItem,
} from "@/lib/dashboard-utils";
import {
  getInDemandSkills,
  getJobProfileMatches,
  getTrendingCareers,
} from "@/lib/jobs-api";
import { getMarketPulseFallbackData } from "@/lib/market-pulse-fallback";
import { listNotifications } from "@/lib/notifications-api";
import { listRoadmaps } from "@/lib/roadmaps-api";
import { listResumes } from "@/lib/resume-api";
import type { GeneratedResumeOut } from "@/types/generated-resume";
import type { InDemandSkill, JobMatch, TrendingCareer } from "@/types/jobs";
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
  readinessScore: number;
  insightHeadline: string;
  activeRoadmap: RoadmapListItem | null;
  latestResume: GeneratedResumeOut | null;
  profileMatchPercent: number | null;
  topJobMatch: JobMatch | null;
  trendingCareers: TrendingCareer[];
  inDemandSkills: InDemandSkill[];
  activities: DashboardActivityItem[];
  suggestedActions: DashboardSuggestedAction[];
  syncItems: DashboardSyncItem[];
  unreadNotifications: number;
};

const EMPTY: DashboardOverviewData = {
  readinessScore: 0,
  insightHeadline:
    "Complete your profile and sync data sources to unlock personalized insights.",
  activeRoadmap: null,
  latestResume: null,
  profileMatchPercent: null,
  topJobMatch: null,
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
  topMatch: JobMatch | null,
  readiness: number,
): string {
  if (topMatch) {
    const pct = jobMatchToPercent(topMatch);
    const role = topMatch.normalized_title || topMatch.job_title;
    if (pct != null) {
      return `Your profile alignment for ${role} roles is ${pct}%. Review gaps in your learning path.`;
    }
    return `Strong matches found for ${role} at ${topMatch.company_name}. Keep building toward ${careerInterest}.`;
  }
  if (readiness > 0) {
    return `Your overall learning readiness is ${readiness}%. Continue your active roadmap to improve market fit.`;
  }
  return `You're focused on ${careerInterest}. Generate a roadmap or sync your data hub to unlock AI insights.`;
}

function buildSuggestedActions(
  roadmaps: RoadmapListItem[],
  hasGithub: boolean,
  hasTranscript: boolean,
  topMatch: JobMatch | null,
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

  if (topMatch && actions.length < 3) {
    actions.push({
      id: "explore-matches",
      title: `Explore ${topMatch.normalized_title || topMatch.job_title} roles`,
      description: `See market demand and companies hiring for roles like yours at ${topMatch.company_name}.`,
      href: "/dashboard/market-trends",
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
  const [data, setData] = useState<DashboardOverviewData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const fallback = getMarketPulseFallbackData();

    try {
      const [
        roadmapsResult,
        resumesResult,
        notificationsResult,
        matchesResult,
        trendingResult,
        skillsResult,
        githubResult,
        transcriptResult,
      ] = await Promise.allSettled([
        listRoadmaps(),
        listResumes(),
        listNotifications({ per_page: 5, page: 1 }),
        getJobProfileMatches({ limit: 5 }),
        getTrendingCareers({ limit: 7, period: 30 }),
        getInDemandSkills({ limit: 6 }),
        getGithubSyncedData(),
        getLatestTranscript(),
      ]);

      const roadmaps =
        roadmapsResult.status === "fulfilled" ? roadmapsResult.value : [];
      const resumes =
        resumesResult.status === "fulfilled" ? resumesResult.value : [];
      const notifications =
        notificationsResult.status === "fulfilled"
          ? notificationsResult.value
          : { notifications: [], total_count: 0, unread_count: 0 };
      const jobMatches =
        matchesResult.status === "fulfilled" ? matchesResult.value : [];
      const trendingCareers =
        trendingResult.status === "fulfilled" && trendingResult.value.length > 0
          ? trendingResult.value
          : fallback.trending;
      const inDemandSkills =
        skillsResult.status === "fulfilled" && skillsResult.value.length > 0
          ? skillsResult.value
          : fallback.skills;

      const topJobMatch = jobMatches[0] ?? null;
      const readinessScore = computeReadinessScore(roadmaps, jobMatches);
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

      setData({
        readinessScore,
        insightHeadline: buildInsightHeadline(
          careerInterest,
          topJobMatch,
          readinessScore,
        ),
        activeRoadmap,
        latestResume,
        profileMatchPercent: jobMatchToPercent(topJobMatch ?? undefined),
        topJobMatch,
        trendingCareers,
        inDemandSkills,
        activities,
        suggestedActions: buildSuggestedActions(
          roadmaps,
          hasGithub,
          hasTranscript,
          topJobMatch,
        ),
        syncItems,
        unreadNotifications: notifications.unread_count,
      });
    } catch {
      setError("Could not load dashboard overview.");
      setData({
        ...EMPTY,
        trendingCareers: fallback.trending,
        inDemandSkills: fallback.skills,
        insightHeadline: buildInsightHeadline(careerInterest, null, 0),
      });
    } finally {
      setLoading(false);
    }
  }, [careerInterest]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
