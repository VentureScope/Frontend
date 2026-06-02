/** Shared TanStack Query keys (Phase 2+ migrations). */

export const queryKeys = {
  notifications: {
    all: ["notifications"] as const,
    summary: () => [...queryKeys.notifications.all, "summary"] as const,
    activity: () => [...queryKeys.notifications.all, "activity"] as const,
    list: (perPage: number) =>
      [...queryKeys.notifications.all, "list", perPage] as const,
  },
  organizations: {
    all: ["organizations"] as const,
    mine: () => [...queryKeys.organizations.all, "mine"] as const,
    detail: (orgId: string) =>
      [...queryKeys.organizations.all, "detail", orgId] as const,
    members: (orgId: string) =>
      [...queryKeys.organizations.all, "members", orgId] as const,
    roadmaps: (orgId: string) =>
      [...queryKeys.organizations.all, "roadmaps", orgId] as const,
    myRoadmaps: (orgIdsKey: string) =>
      [...queryKeys.organizations.all, "my-roadmaps", orgIdsKey] as const,
    myMemberContexts: (orgFilter: string, orgIdsKey: string, userId: string) =>
      [
        ...queryKeys.organizations.all,
        "my-member-contexts",
        orgFilter,
        orgIdsKey,
        userId,
      ] as const,
  },
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
    github: () => [...queryKeys.profile.all, "github"] as const,
    transcriptLatest: () =>
      [...queryKeys.profile.all, "transcript", "latest"] as const,
    experiences: () => [...queryKeys.profile.all, "experiences"] as const,
    certificates: () => [...queryKeys.profile.all, "certificates"] as const,
  },
  dataHub: {
    all: ["data-hub"] as const,
    transcriptList: () =>
      [...queryKeys.dataHub.all, "transcript", "list"] as const,
    transcriptConfig: () =>
      [...queryKeys.dataHub.all, "transcript", "config"] as const,
  },
  market: {
    all: ["market"] as const,
    trending: (days: number, limit: number) =>
      [...queryKeys.market.all, "trending", days, limit] as const,
    forecasts: () => [...queryKeys.market.all, "forecasts"] as const,
    futureRoadmapRoles: (limit: number) =>
      [...queryKeys.market.all, "future-roadmap-roles", limit] as const,
    inDemandSkills: (days: number, limit: number) =>
      [...queryKeys.market.all, "in-demand-skills", days, limit] as const,
    jobStats: (period: number) =>
      [...queryKeys.market.all, "job-stats", period] as const,
    hiringCompanies: (days: number, categoriesKey: string) =>
      [
        ...queryKeys.market.all,
        "hiring-companies",
        days,
        categoriesKey,
      ] as const,
    roleForecasts: (role: string) =>
      [...queryKeys.market.all, "forecasts", role] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    overview: () => [...queryKeys.dashboard.all, "overview"] as const,
  },
  roadmaps: {
    all: ["roadmaps"] as const,
    list: () => [...queryKeys.roadmaps.all, "list"] as const,
    detail: (roadmapId: string) =>
      [...queryKeys.roadmaps.all, "detail", roadmapId] as const,
  },
  resumes: {
    all: ["resumes"] as const,
    list: () => [...queryKeys.resumes.all, "list"] as const,
    detail: (resumeId: string) =>
      [...queryKeys.resumes.all, "detail", resumeId] as const,
  },
  readiness: {
    all: ["readiness"] as const,
    user: () => [...queryKeys.readiness.all, "user"] as const,
  },
} as const;
