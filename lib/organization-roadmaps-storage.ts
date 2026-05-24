import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import { roadmapOutToLearningPath } from "@/lib/map-roadmap-to-learning-path";
import type { RoadmapOut } from "@/types/roadmap";

/** Local sessionStorage for personal roadmap forks (no API yet). */
export const ORG_ROADMAPS_STORAGE_KEY = "venturescope-org-roadmaps-v1";

function loadAll(): OrganizationRoadmap[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = sessionStorage.getItem(ORG_ROADMAPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrganizationRoadmap[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(roadmaps: OrganizationRoadmap[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ORG_ROADMAPS_STORAGE_KEY, JSON.stringify(roadmaps));
}

export function saveOrganizationRoadmaps(roadmaps: OrganizationRoadmap[]): void {
  saveAll(roadmaps);
}

export function loadOrganizationRoadmaps(): OrganizationRoadmap[] {
  return loadAll();
}

export function loadOrganizationRoadmapsForOrg(orgId: string): OrganizationRoadmap[] {
  return loadAll().filter((r) => r.orgId === orgId);
}

export function addOrganizationRoadmapFromApi(
  orgId: string,
  apiRoadmap: RoadmapOut,
  meta: {
    createdByUserId: string;
    createdByName: string;
    focusAreaId: string;
    focusAreaTitle: string;
    iconName?: string;
  },
): OrganizationRoadmap {
  const base = roadmapOutToLearningPath(apiRoadmap, meta.iconName ?? "BarChart2");
  const entry: OrganizationRoadmap = {
    ...base,
    orgId,
    contentRoadmapId: apiRoadmap.id,
    createdByUserId: meta.createdByUserId,
    createdByName: meta.createdByName,
    focusAreaId: meta.focusAreaId,
    focusAreaTitle: meta.focusAreaTitle,
    participants: [
      {
        id: meta.createdByUserId,
        name: meta.createdByName,
        initials: meta.createdByName
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        progress: 0,
      },
    ],
  };

  const all = loadAll();
  all.unshift(entry);
  saveAll(all);
  return entry;
}

export function getOrganizationRoadmapById(
  orgId: string,
  roadmapId: string,
): OrganizationRoadmap | undefined {
  return loadAll().find((r) => r.orgId === orgId && r.id === roadmapId);
}
