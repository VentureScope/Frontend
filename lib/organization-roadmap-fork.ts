import type { Module } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import type {
  OrganizationRoadmap,
  OrgRoadmapForkSource,
} from "@/types/organization-roadmap";
import {
  loadOrganizationRoadmaps,
  saveOrganizationRoadmaps,
} from "@/lib/organization-roadmaps-storage";

function memberInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function newForkId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `org-rm-fork-${crypto.randomUUID()}`;
  }
  return `org-rm-fork-${Date.now()}`;
}

/** Reset module/resource progress for a fresh personal copy */
function cloneModulesForFork(modules: Module[]): Module[] {
  return modules.map((mod, modIndex) => {
    const moduleStatus = modIndex === 0 ? "in-progress" : "locked";
    return {
      ...mod,
      status: moduleStatus,
      resources: mod.resources.map((resource, resourceIndex) => ({
        ...resource,
        status:
          moduleStatus === "locked"
            ? "locked"
            : resourceIndex === 0
              ? "in-progress"
              : "locked",
      })),
    };
  });
}

export function isPersonalFork(roadmap: OrganizationRoadmap): boolean {
  return Boolean(roadmap.forkedFrom?.roadmapId);
}

export function findUserForkOfRoadmap(
  orgId: string,
  sourceRoadmapId: string,
  userId: string,
  roadmaps = loadOrganizationRoadmaps(),
): OrganizationRoadmap | undefined {
  return roadmaps.find(
    (r) =>
      r.orgId === orgId &&
      r.createdByUserId === userId &&
      r.forkedFrom?.roadmapId === sourceRoadmapId,
  );
}

export function buildForkedRoadmap(
  source: OrganizationRoadmap,
  userId: string,
  userName: string,
): OrganizationRoadmap {
  const forkedFrom: OrgRoadmapForkSource = {
    roadmapId: source.id,
    title: source.title,
    createdByName: source.createdByName,
  };

  return {
    id: newForkId(),
    orgId: source.orgId,
    title: source.title,
    focus: source.focus,
    progress: 0,
    iconName: source.iconName,
    isExpanded: false,
    modules: cloneModulesForFork(source.modules),
    roadmapStatus: source.roadmapStatus,
    createdAt: new Date().toISOString(),
    trendName: source.trendName,
    focusAreaId: source.focusAreaId,
    focusAreaTitle: source.focusAreaTitle,
    createdByUserId: userId,
    createdByName: userName,
    forkedFrom,
    participants: [
      {
        id: userId,
        name: userName,
        initials: memberInitials(userName),
        progress: 0,
      },
    ],
  };
}

export function forkOrganizationRoadmap(
  source: OrganizationRoadmap,
  userId: string,
  userName: string,
): OrganizationRoadmap {
  const existing = findUserForkOfRoadmap(source.orgId, source.id, userId);
  if (existing) {
    return existing;
  }

  const forked = buildForkedRoadmap(source, userId, userName);
  const all = loadOrganizationRoadmaps();
  all.unshift(forked);
  saveOrganizationRoadmaps(all);
  return forked;
}
