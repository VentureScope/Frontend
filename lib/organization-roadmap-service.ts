import { AxiosError } from "axios";
import { getRoadmap } from "@/lib/roadmaps-api";
import { roadmapOutToLearningPath } from "@/lib/map-roadmap-to-learning-path";
import {
  mergeOrgRoadmapWithContent,
  mergeRoadmapContentIntoOrgRoadmap,
  orgRoadmapOutToOrganizationRoadmap,
  parseOrgRoadmapListItemApi,
  parseOrgRoadmapOutApi,
  parseOrganizationRoadmapList,
} from "@/lib/organization-roadmap-parsers";
import {
  getOrganizationRoadmap,
  listOrganizationRoadmaps,
} from "@/lib/organizations-api";
import { orgRoadmapDetailId } from "@/lib/organization-roadmap-utils";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import type { OrganizationMember } from "@/types/organization-profile";

export function isOrgRoadmapNotFoundError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404;
}

export type FetchOrganizationRoadmapDetailResult = {
  roadmap: OrganizationRoadmap;
  /** Canonical content `roadmap_id` used in URLs and both API paths. */
  resolvedRoadmapId: string;
};

/**
 * Resolve a URL segment using an already-fetched roadmap list (no HTTP).
 */
export function resolveOrgRoadmapContentIdFromList(
  orgId: string,
  idFromUrl: string,
  listRaw: unknown,
  members: OrganizationMember[] = [],
): string | null {
  const items = parseOrganizationRoadmapList(listRaw, orgId, members);

  const byRoadmapId = items.find((item) => item.id === idFromUrl);
  if (byRoadmapId) {
    return byRoadmapId.id;
  }

  const byAssignmentId = items.find((item) => item.assignmentId === idFromUrl);
  if (byAssignmentId) {
    return byAssignmentId.id;
  }

  if (!Array.isArray(listRaw)) {
    return null;
  }

  for (const entry of listRaw) {
    const parsed = parseOrgRoadmapListItemApi(entry);
    if (!parsed) continue;
    if (parsed.id === idFromUrl || parsed.roadmap_id === idFromUrl) {
      return parsed.roadmap_id;
    }
  }

  return null;
}

/**
 * Resolve a URL segment to the content `roadmap_id`.
 * Accepts legacy assignment ids in bookmarks.
 */
export async function resolveOrgRoadmapContentId(
  orgId: string,
  idFromUrl: string,
  members: OrganizationMember[] = [],
): Promise<string | null> {
  const listRaw = await listOrganizationRoadmaps(orgId);
  return resolveOrgRoadmapContentIdFromList(
    orgId,
    idFromUrl,
    listRaw,
    members,
  );
}

/** @deprecated Use {@link resolveOrgRoadmapContentId}. */
export async function resolveOrgRoadmapAssignmentId(
  orgId: string,
  idFromUrl: string,
  members: OrganizationMember[] = [],
): Promise<string | null> {
  return resolveOrgRoadmapContentId(orgId, idFromUrl, members);
}

/**
 * Basic org roadmap — GET /api/organizations/{org_id}/roadmaps/{roadmap_id}
 * Team enrollment, per-member progress, creator. No step/resource tree.
 */
export async function fetchOrgRoadmapSummary(
  orgId: string,
  roadmapId: string,
  members: OrganizationMember[] = [],
): Promise<OrganizationRoadmap> {
  const orgRaw = await getOrganizationRoadmap(orgId, roadmapId);
  const parsed = parseOrgRoadmapOutApi(orgRaw);
  if (!parsed) {
    throw new Error("Invalid organization roadmap response.");
  }
  return orgRoadmapOutToOrganizationRoadmap(parsed, orgId, members);
}

/**
 * Detailed roadmap content — GET /api/roadmaps/{roadmap_id}
 * Steps, resources, and per-resource progress. Shared by personal + org UIs.
 */
export async function fetchRoadmapContent(roadmapId: string) {
  return getRoadmap(roadmapId);
}

/**
 * Expand an org list card: keep org list metadata, load step tree from
 * GET /api/roadmaps/{roadmap_id} only.
 */
export async function loadOrgRoadmapExpandedContent(
  existing: OrganizationRoadmap,
): Promise<OrganizationRoadmap> {
  const roadmapId = orgRoadmapDetailId(existing);
  const content = await fetchRoadmapContent(roadmapId);
  return mergeRoadmapContentIntoOrgRoadmap(existing, content);
}

/**
 * Lesson-focused org detail page: detailed content + org summary for actions only.
 * - GET /api/roadmaps/{roadmap_id} — steps, resources, your progress
 * - GET /api/organizations/{org_id}/roadmaps/{roadmap_id} — enroll / creator (not shown as team UI)
 */
export type FetchOrgRoadmapLessonPageOptions = {
  /** When set, skips listOrganizationRoadmaps (use React Query cache). */
  roadmapsListRaw?: unknown;
};

export async function fetchOrgRoadmapLessonPage(
  orgId: string,
  roadmapIdFromUrl: string,
  members: OrganizationMember[],
  options?: FetchOrgRoadmapLessonPageOptions,
): Promise<FetchOrganizationRoadmapDetailResult> {
  const resolvedRoadmapId =
    (options?.roadmapsListRaw != null
      ? resolveOrgRoadmapContentIdFromList(
          orgId,
          roadmapIdFromUrl,
          options.roadmapsListRaw,
          members,
        )
      : await resolveOrgRoadmapContentId(orgId, roadmapIdFromUrl, members)) ??
    roadmapIdFromUrl;

  const [content, orgSummary] = await Promise.all([
    getRoadmap(resolvedRoadmapId),
    fetchOrgRoadmapSummary(orgId, resolvedRoadmapId, members).catch(() => null),
  ]);

  const learningPath = roadmapOutToLearningPath(content);

  const roadmap: OrganizationRoadmap = orgSummary
    ? mergeRoadmapContentIntoOrgRoadmap(orgSummary, content)
    : {
        ...learningPath,
        orgId,
        contentRoadmapId: resolvedRoadmapId,
        createdByUserId: "",
        createdByName: "Organization",
        participants: [],
      };

  return { roadmap, resolvedRoadmapId };
}

/**
 * Full org detail (org metadata + content merged). Prefer {@link fetchOrgRoadmapLessonPage} for UI.
 */
export async function fetchOrganizationRoadmapDetail(
  orgId: string,
  roadmapIdFromUrl: string,
  members: OrganizationMember[],
): Promise<FetchOrganizationRoadmapDetailResult> {
  const resolvedRoadmapId =
    (await resolveOrgRoadmapContentId(orgId, roadmapIdFromUrl, members)) ??
    roadmapIdFromUrl;

  const [orgRaw, content] = await Promise.all([
    getOrganizationRoadmap(orgId, resolvedRoadmapId),
    getRoadmap(resolvedRoadmapId),
  ]);

  const parsed = parseOrgRoadmapOutApi(orgRaw);
  if (!parsed) {
    throw new Error("Invalid organization roadmap response.");
  }

  const roadmap = mergeOrgRoadmapWithContent(
    parsed,
    content,
    orgId,
    members,
  );

  return { roadmap, resolvedRoadmapId };
}
