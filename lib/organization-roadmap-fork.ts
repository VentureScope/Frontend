import { getApiErrorMessage } from "@/lib/auth-api";
import {
  fetchOrganizationRoadmapDetail,
  isOrgRoadmapNotFoundError,
} from "@/lib/organization-roadmap-service";
import {
  parseOrgRoadmapOutApi,
  parseOrganizationRoadmapList,
} from "@/lib/organization-roadmap-parsers";
import { forkOrganizationRoadmapApi } from "@/lib/organizations-api";
import type {
  OrganizationRoadmap,
  OrgRoadmapForkSource,
} from "@/types/organization-roadmap";
import type { OrganizationMember } from "@/types/organization-profile";

const FORK_META_KEY = "venturescope-org-fork-meta-v2";
const FORK_INDEX_KEY = "venturescope-org-fork-index-v2";

type ForkMetaStore = Record<string, OrgRoadmapForkSource>;
type ForkIndexStore = Record<string, string>;

function forkIndexKey(orgId: string, sourceRoadmapId: string, userId: string) {
  return `${orgId}:${sourceRoadmapId}:${userId}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

function saveForkMetadata(forkId: string, source: OrgRoadmapForkSource) {
  const store = readJson<ForkMetaStore>(FORK_META_KEY, {});
  store[forkId] = source;
  writeJson(FORK_META_KEY, store);
}

function saveForkIndex(
  orgId: string,
  sourceRoadmapId: string,
  userId: string,
  forkId: string,
) {
  const store = readJson<ForkIndexStore>(FORK_INDEX_KEY, {});
  store[forkIndexKey(orgId, sourceRoadmapId, userId)] = forkId;
  writeJson(FORK_INDEX_KEY, store);
}

export function clearForkReferences(orgId: string, forkId: string) {
  if (typeof window === "undefined") return;

  const meta = readJson<ForkMetaStore>(FORK_META_KEY, {});
  const sourceId = meta[forkId]?.roadmapId;
  delete meta[forkId];
  writeJson(FORK_META_KEY, meta);

  const index = readJson<ForkIndexStore>(FORK_INDEX_KEY, {});
  if (sourceId) {
    for (const key of Object.keys(index)) {
      if (key.startsWith(`${orgId}:${sourceId}:`) && index[key] === forkId) {
        delete index[key];
      }
    }
  }
  writeJson(FORK_INDEX_KEY, index);
}

export function getForkMetadata(
  forkId: string,
): OrgRoadmapForkSource | undefined {
  const store = readJson<ForkMetaStore>(FORK_META_KEY, {});
  return store[forkId];
}

export function attachForkMetadata(
  roadmap: OrganizationRoadmap,
): OrganizationRoadmap {
  const forkedFrom = getForkMetadata(roadmap.id);
  if (!forkedFrom) return roadmap;
  return { ...roadmap, forkedFrom };
}

export function isPersonalFork(roadmap: OrganizationRoadmap): boolean {
  return Boolean(roadmap.forkedFrom?.roadmapId || getForkMetadata(roadmap.id));
}

/** Map team roadmap id → personal fork id using list data + validated session hints. */
export function buildUserForkMapFromRoadmaps(
  orgId: string,
  roadmaps: OrganizationRoadmap[],
  userId: string,
): Map<string, string> {
  const knownIds = new Set(roadmaps.map((r) => r.id));
  const map = new Map<string, string>();

  for (const roadmap of roadmaps) {
    const sourceId =
      roadmap.forkedFrom?.roadmapId ?? getForkMetadata(roadmap.id)?.roadmapId;
    if (sourceId) {
      map.set(sourceId, roadmap.id);
    }
  }

  for (const roadmap of roadmaps) {
    const storedForkId = readJson<ForkIndexStore>(FORK_INDEX_KEY, {})[
      forkIndexKey(orgId, roadmap.id, userId)
    ];
    if (storedForkId && knownIds.has(storedForkId)) {
      map.set(roadmap.id, storedForkId);
    }
  }

  return map;
}

export function findUserForkOfRoadmap(
  orgId: string,
  sourceRoadmapId: string,
  userId: string,
  roadmaps: OrganizationRoadmap[] = [],
): string | undefined {
  const fromList = buildUserForkMapFromRoadmaps(orgId, roadmaps, userId).get(
    sourceRoadmapId,
  );
  if (fromList) return fromList;

  const stored = readJson<ForkIndexStore>(FORK_INDEX_KEY, {})[
    forkIndexKey(orgId, sourceRoadmapId, userId)
  ];
  if (stored && roadmaps.some((r) => r.id === stored)) {
    return stored;
  }

  if (stored) {
    clearForkReferences(orgId, stored);
  }
  return undefined;
}

export async function forkOrganizationRoadmap(
  orgId: string,
  source: OrganizationRoadmap,
  userId: string,
  userName: string,
  members: OrganizationMember[] = [],
): Promise<OrganizationRoadmap> {
  const existingId = findUserForkOfRoadmap(orgId, source.id, userId, [source]);
  if (existingId) {
    try {
      const { roadmap } = await fetchOrganizationRoadmapDetail(
        orgId,
        existingId,
        members,
      );
      return attachForkMetadata(roadmap);
    } catch (error) {
      if (isOrgRoadmapNotFoundError(error)) {
        clearForkReferences(orgId, existingId);
      } else {
        throw error;
      }
    }
  }

  const forkedFrom: OrgRoadmapForkSource = {
    roadmapId: source.id,
    title: source.title,
    createdByName: source.createdByName,
  };

  let forkAssignmentId: string | null = null;

  try {
    const forkResponse = await forkOrganizationRoadmapApi(orgId, source.id);
    const parsedFork = parseOrgRoadmapOutApi(forkResponse);
    if (parsedFork?.id) {
      forkAssignmentId = parsedFork.id;
    }
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }

  if (!forkAssignmentId) {
    const { listOrganizationRoadmaps } = await import("@/lib/organizations-api");
    const listRaw = await listOrganizationRoadmaps(orgId);
    const parsed = parseOrganizationRoadmapList(listRaw, orgId, members);

    const forkCandidate = parsed
      .filter((r) => r.id !== source.id && r.createdByUserId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      )[0];

    if (!forkCandidate) {
      throw new Error("Fork created but the new roadmap could not be loaded.");
    }
    forkAssignmentId = forkCandidate.id;
  }

  saveForkMetadata(forkAssignmentId, forkedFrom);
  saveForkIndex(orgId, source.id, userId, forkAssignmentId);

  const { roadmap } = await fetchOrganizationRoadmapDetail(
    orgId,
    forkAssignmentId,
    members,
  );

  return {
    ...attachForkMetadata(roadmap),
    forkedFrom,
    createdByUserId: userId,
    createdByName: userName,
  };
}
