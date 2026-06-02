import {
  fetchOrgRoadmapLessonPage,
  type FetchOrganizationRoadmapDetailResult,
} from "@/lib/organization-roadmap-service";
import type { OrganizationMember } from "@/types/organization-profile";

export async function fetchOrganizationRoadmapDetail(
  orgId: string,
  roadmapId: string,
  members: OrganizationMember[],
  roadmapsListRaw: unknown,
): Promise<FetchOrganizationRoadmapDetailResult> {
  return fetchOrgRoadmapLessonPage(orgId, roadmapId, members, {
    roadmapsListRaw,
  });
}
