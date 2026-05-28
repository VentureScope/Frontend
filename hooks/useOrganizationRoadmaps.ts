"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseOrganizationRoadmapList } from "@/lib/organization-roadmap-parsers";
import { loadOrgRoadmapExpandedContent } from "@/lib/organization-roadmap-service";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useOrganizationRoadmapsQuery } from "@/hooks/queries/use-organization-roadmaps-query";
import { matchesOrgRoadmapId } from "@/lib/organization-roadmap-utils";
import { canAssignRoadmaps } from "@/lib/organization-permissions";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";

export function useOrganizationRoadmaps(orgId: string) {
  const roadmapsQuery = useOrganizationRoadmapsQuery(orgId);
  const {
    members,
    myRole,
    loading: membersLoading,
    reload: reloadMembers,
  } = useOrganizationMembers(orgId);

  const parsedRoadmaps = useMemo((): OrganizationRoadmap[] => {
    if (!roadmapsQuery.data || !orgId) return [];
    return parseOrganizationRoadmapList(roadmapsQuery.data, orgId, members);
  }, [roadmapsQuery.data, orgId, members]);

  const [roadmaps, setRoadmaps] = useState<OrganizationRoadmap[]>([]);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);

  useEffect(() => {
    setRoadmaps(parsedRoadmaps);
  }, [parsedRoadmaps]);

  const canCreate = canAssignRoadmaps(myRole);

  const reload = useCallback(async () => {
    await Promise.all([roadmapsQuery.refetch(), reloadMembers()]);
  }, [roadmapsQuery, reloadMembers]);

  const loadRoadmapDetail = useCallback(
    async (roadmapId: string) => {
      setLoadingDetailId(roadmapId);
      try {
        const existing = roadmaps.find((r) => matchesOrgRoadmapId(r, roadmapId));
        if (!existing) {
          throw new Error("Roadmap not found in list.");
        }
        const detail = await loadOrgRoadmapExpandedContent(existing);
        setRoadmaps((prev) =>
          prev.map((r) => (matchesOrgRoadmapId(r, roadmapId) ? detail : r)),
        );
        return detail;
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      } finally {
        setLoadingDetailId(null);
      }
    },
    [roadmaps],
  );

  const listLoading = roadmapsQuery.isPending;
  const error = roadmapsQuery.error
    ? getApiErrorMessage(roadmapsQuery.error)
    : null;

  return {
    roadmaps,
    members,
    loading: listLoading || (membersLoading && roadmaps.length === 0 && !error),
    error,
    canCreate,
    myRole,
    reload,
    loadRoadmapDetail,
    loadingDetailId,
    setRoadmaps,
    roadmapsListRaw: roadmapsQuery.data,
  };
}
