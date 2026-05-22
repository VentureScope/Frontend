"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseOrganizationRoadmapList } from "@/lib/organization-roadmap-parsers";
import { fetchOrganizationRoadmapDetail } from "@/lib/organization-roadmap-service";
import { listOrganizationRoadmaps } from "@/lib/organizations-api";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { canAssignRoadmaps } from "@/lib/organization-permissions";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";

export function useOrganizationRoadmaps(orgId: string) {
  const {
    members,
    myRole,
    loading: membersLoading,
  } = useOrganizationMembers(orgId);

  const [roadmaps, setRoadmaps] = useState<OrganizationRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);

  const canCreate = canAssignRoadmaps(myRole);

  const reload = useCallback(async () => {
    if (!orgId) {
      setRoadmaps([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listOrganizationRoadmaps(orgId);
      setRoadmaps(parseOrganizationRoadmapList(data, orgId, members));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setRoadmaps([]);
    } finally {
      setLoading(false);
    }
  }, [orgId, members]);

  useEffect(() => {
    if (!membersLoading) {
      void reload();
    }
  }, [reload, membersLoading]);

  const loadRoadmapDetail = useCallback(
    async (orgRoadmapId: string) => {
      setLoadingDetailId(orgRoadmapId);
      try {
        const detail = await fetchOrganizationRoadmapDetail(
          orgId,
          orgRoadmapId,
          members,
        );
        setRoadmaps((prev) =>
          prev.map((r) => (r.id === orgRoadmapId ? detail : r)),
        );
        return detail;
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      } finally {
        setLoadingDetailId(null);
      }
    },
    [orgId, members],
  );

  return {
    roadmaps,
    loading: loading || membersLoading,
    error,
    canCreate,
    myRole,
    reload,
    loadRoadmapDetail,
    loadingDetailId,
    setRoadmaps,
  };
}
