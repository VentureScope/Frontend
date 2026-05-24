import type { OrganizationListItem } from "@/types/organization";
import { isPersonalFork } from "@/lib/organization-roadmap-fork";
import type {
  MyRoadmapsTab,
  OrganizationRoadmap,
  OrgTeamRoadmapsFilter,
} from "@/types/organization-roadmap";

export { isPersonalFork };

export function resolveCurrentUserId(authUserId?: string | null): string {
  return authUserId ?? "user-demo";
}

export function getMyProgress(
  roadmap: OrganizationRoadmap,
  userId: string,
): number {
  if (roadmap.myEnrollment?.enrolled) {
    return Math.round(
      Math.min(100, Math.max(0, roadmap.myEnrollment.completionPercentage)),
    );
  }
  const me = roadmap.participants.find((p) => p.id === userId);
  return me?.progress ?? 0;
}

export function isEnrolledInRoadmap(
  roadmap: OrganizationRoadmap,
  userId: string,
): boolean {
  if (roadmap.myEnrollment?.enrolled) {
    return true;
  }
  if (isPersonalFork(roadmap)) {
    return roadmap.createdByUserId === userId;
  }
  return roadmap.participants.some((p) => p.id === userId);
}

export function isCreatedByUser(
  roadmap: OrganizationRoadmap,
  userId: string,
): boolean {
  return roadmap.createdByUserId === userId;
}

export function filterMyRoadmaps(
  roadmaps: OrganizationRoadmap[],
  userId: string,
  tab: MyRoadmapsTab,
): OrganizationRoadmap[] {
  switch (tab) {
    case "enrolled":
      return roadmaps.filter((r) => isEnrolledInRoadmap(r, userId));
    case "created":
      return roadmaps.filter((r) => isCreatedByUser(r, userId));
    default:
      return roadmaps.filter(
        (r) =>
          isEnrolledInRoadmap(r, userId) || isCreatedByUser(r, userId),
      );
  }
}

export function filterOrgTeamRoadmaps(
  roadmaps: OrganizationRoadmap[],
  userId: string,
  filter: OrgTeamRoadmapsFilter,
): OrganizationRoadmap[] {
  /** Personal forks live on My roadmaps, not the shared team list */
  const teamShared = roadmaps.filter((r) => !isPersonalFork(r));
  if (filter === "created-by-me") {
    return teamShared.filter((r) => isCreatedByUser(r, userId));
  }
  return teamShared;
}

export function groupRoadmapsByOrg(
  roadmaps: OrganizationRoadmap[],
  organizations: OrganizationListItem[],
): { org: OrganizationListItem; roadmaps: OrganizationRoadmap[] }[] {
  const orgMap = new Map(organizations.map((o) => [o.id, o]));
  const grouped = new Map<string, OrganizationRoadmap[]>();

  for (const roadmap of roadmaps) {
    const list = grouped.get(roadmap.orgId) ?? [];
    list.push(roadmap);
    grouped.set(roadmap.orgId, list);
  }

  return [...grouped.entries()]
    .map(([orgId, items]) => {
      const org = orgMap.get(orgId);
      if (!org) {
        return null;
      }
      return {
        org,
        roadmaps: [...items].sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        ),
      };
    })
    .filter(
      (entry): entry is { org: OrganizationListItem; roadmaps: OrganizationRoadmap[] } =>
        entry !== null,
    );
}

export function getRoadmapById(
  roadmaps: OrganizationRoadmap[],
  id: string,
): OrganizationRoadmap | undefined {
  return roadmaps.find(
    (r) => r.id === id || r.contentRoadmapId === id || r.assignmentId === id,
  );
}

/** Content `roadmap_id` for org detail URLs and API paths. */
export function orgRoadmapDetailId(roadmap: OrganizationRoadmap): string {
  return roadmap.contentRoadmapId ?? roadmap.id;
}

export function matchesOrgRoadmapId(
  roadmap: OrganizationRoadmap,
  id: string,
): boolean {
  return (
    roadmap.id === id ||
    roadmap.contentRoadmapId === id ||
    roadmap.assignmentId === id
  );
}
