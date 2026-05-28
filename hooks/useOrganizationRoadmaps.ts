"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseOrganizationRoadmapList } from "@/lib/organization-roadmap-parsers";
import { loadOrgRoadmapExpandedContent } from "@/lib/organization-roadmap-service";
import { listOrganizationRoadmaps } from "@/lib/organizations-api";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { matchesOrgRoadmapId } from "@/lib/organization-roadmap-utils";
import { canAssignRoadmaps } from "@/lib/organization-permissions";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";

export function useOrganizationRoadmaps(orgId: string) {
  const {
    members,
    myRole,
    loading: membersLoading,
    reload: reloadMembers,
  } = useOrganizationMembers(orgId);

  const [rawList, setRawList] = useState<unknown>(null);
  const [roadmaps, setRoadmaps] = useState<OrganizationRoadmap[]>([]);
  const [listLoading, setListLoading] = useState(Boolean(orgId));
  const [error, setError] = useState<string | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);

  const canCreate = canAssignRoadmaps(myRole);

  const fetchRoadmapList = useCallback(async () => {
    if (!orgId) {
      setRawList(null);
      setRoadmaps([]);
      setListLoading(false);
      return;
    }

    setListLoading(true);
    setError(null);

    try {
      const data = await listOrganizationRoadmaps(orgId);
      setRawList(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setRawList(null);
      setRoadmaps([]);
    } finally {
      setListLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void fetchRoadmapList();
  }, [fetchRoadmapList]);

  useEffect(() => {
    if (!rawList || !orgId) return;
    setRoadmaps(parseOrganizationRoadmapList(rawList, orgId, members));
  }, [rawList, orgId, members]);

  const reload = useCallback(async () => {
    await Promise.all([fetchRoadmapList(), reloadMembers()]);
  }, [fetchRoadmapList, reloadMembers]);

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
  };
}
