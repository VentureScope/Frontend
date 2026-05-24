import { AxiosError } from "axios";
import { getRoadmap } from "@/lib/roadmaps-api";
import {
  mergeOrgRoadmapWithContent,
  parseOrgRoadmapListItemApi,
  parseOrgRoadmapOutApi,
  parseOrganizationRoadmapList,
} from "@/lib/organization-roadmap-parsers";
import {
  getOrganizationRoadmap,
  listOrganizationRoadmaps,
} from "@/lib/organizations-api";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import type { OrganizationMember } from "@/types/organization-profile";

export function isOrgRoadmapNotFoundError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404;
}

export type FetchOrganizationRoadmapDetailResult = {
  roadmap: OrganizationRoadmap;
  /** When the URL id was a content roadmap id, this is the org assignment id used. */
  resolvedOrgRoadmapId: string;
};

async function loadOrganizationRoadmapDetail(
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

/**
 * Resolve a URL segment to an org roadmap assignment id.
 * Handles stale ids and mistaken content `roadmap_id` in the URL.
 */
export async function resolveOrgRoadmapAssignmentId(
  orgId: string,
  idFromUrl: string,
  members: OrganizationMember[] = [],
): Promise<string | null> {
  try {
    await getOrganizationRoadmap(orgId, idFromUrl);
    return idFromUrl;
  } catch (error) {
    if (!isOrgRoadmapNotFoundError(error)) {
      throw error;
    }
  }

  const listRaw = await listOrganizationRoadmaps(orgId);
  const items = parseOrganizationRoadmapList(listRaw, orgId, members);

  const byContentId = items.find(
    (item) => item.contentRoadmapId === idFromUrl,
  );
  if (byContentId) {
    return byContentId.id;
  }

  for (const entry of listRaw) {
    const parsed = parseOrgRoadmapListItemApi(entry);
    if (parsed && parsed.roadmap_id === idFromUrl) {
      return parsed.id;
    }
  }

  return null;
}

/** Load org assignment metadata plus full roadmap steps for detail/expand views. */
export async function fetchOrganizationRoadmapDetail(
  orgId: string,
  orgRoadmapId: string,
  members: OrganizationMember[],
): Promise<FetchOrganizationRoadmapDetailResult> {
  const resolvedOrgRoadmapId =
    (await resolveOrgRoadmapAssignmentId(orgId, orgRoadmapId, members)) ??
    orgRoadmapId;

  try {
    const roadmap = await loadOrganizationRoadmapDetail(
      orgId,
      resolvedOrgRoadmapId,
      members,
    );
    return { roadmap, resolvedOrgRoadmapId };
  } catch (error) {
    if (!isOrgRoadmapNotFoundError(error)) {
      throw error;
    }

    const retryId = await resolveOrgRoadmapAssignmentId(
      orgId,
      orgRoadmapId,
      members,
    );
    if (!retryId || retryId === resolvedOrgRoadmapId) {
      throw error;
    }

    const roadmap = await loadOrganizationRoadmapDetail(
      orgId,
      retryId,
      members,
    );
    return { roadmap, resolvedOrgRoadmapId: retryId };
  }
}
