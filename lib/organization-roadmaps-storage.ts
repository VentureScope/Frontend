import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import { MOCK_ORGANIZATION_ROADMAPS } from "@/lib/organization-roadmaps-data";
import { roadmapOutToLearningPath } from "@/lib/map-roadmap-to-learning-path";
import type { RoadmapOut } from "@/types/roadmap";
export const ORG_ROADMAPS_STORAGE_KEY = "venturescope-org-roadmaps-v1";

function loadAll(): OrganizationRoadmap[] {
  if (typeof window === "undefined") {
    return [...MOCK_ORGANIZATION_ROADMAPS];
  }
  try {
    const raw = sessionStorage.getItem(ORG_ROADMAPS_STORAGE_KEY);
    if (!raw) {
      sessionStorage.setItem(
        ORG_ROADMAPS_STORAGE_KEY,
        JSON.stringify(MOCK_ORGANIZATION_ROADMAPS),
      );
      return [...MOCK_ORGANIZATION_ROADMAPS];
    }
    const parsed = JSON.parse(raw) as OrganizationRoadmap[];
    if (!Array.isArray(parsed)) {
      return [...MOCK_ORGANIZATION_ROADMAPS];
    }
    return parsed;
  } catch {
    return [...MOCK_ORGANIZATION_ROADMAPS];
  }
}

function saveAll(roadmaps: OrganizationRoadmap[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ORG_ROADMAPS_STORAGE_KEY, JSON.stringify(roadmaps));
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
