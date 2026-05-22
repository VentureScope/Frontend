import { getRoadmap } from "@/lib/roadmaps-api";
import {
  mergeOrgRoadmapWithContent,
  parseOrgRoadmapOutApi,
} from "@/lib/organization-roadmap-parsers";
import { getOrganizationRoadmap } from "@/lib/organizations-api";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import type { OrganizationMember } from "@/types/organization-profile";

/** Load org assignment metadata plus full roadmap steps for detail/expand views. */
export async function fetchOrganizationRoadmapDetail(
  orgId: string,
  orgRoadmapId: string,
  members: OrganizationMember[],
): Promise<OrganizationRoadmap> {
  const orgRaw = await getOrganizationRoadmap(orgId, orgRoadmapId);
  const parsed = parseOrgRoadmapOutApi(orgRaw);
  if (!parsed) {
    throw new Error("Invalid organization roadmap response.");
  }

  const content = await getRoadmap(parsed.roadmap_id);
  return mergeOrgRoadmapWithContent(parsed, content, orgId, members);
}
