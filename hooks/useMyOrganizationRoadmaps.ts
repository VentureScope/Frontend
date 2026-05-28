"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { attachForkMetadata } from "@/lib/organization-roadmap-fork";
import { parseOrganizationRoadmapList } from "@/lib/organization-roadmap-parsers";
import { fetchOrganizationRoadmapsRaw } from "@/lib/queries/organization-roadmaps";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";
import { queryKeys } from "@/lib/query-keys";
import type { OrganizationListItem } from "@/types/organization";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";

async function fetchAllMyOrgRoadmaps(
  orgs: OrganizationListItem[],
  queryClient: QueryClient,
): Promise<OrganizationRoadmap[]> {
  const lists = await Promise.all(
    orgs.map(async (org) => {
      try {
        const data = await queryClient.fetchQuery({
          queryKey: queryKeys.organizations.roadmaps(org.id),
          queryFn: () => fetchOrganizationRoadmapsRaw(org.id),
        });
        return parseOrganizationRoadmapList(data, org.id, []);
      } catch {
        return [];
      }
    }),
  );

  return lists.flat();
}

export function useMyOrganizationRoadmaps() {
  const queryClient = useQueryClient();
  const { organizations, loading: orgsLoading } = useOrganizationsList();

  const orgIdsKey = useMemo(
    () => organizations.map((o) => o.id).sort().join(","),
    [organizations],
  );

  const roadmapsQuery = useQuery({
    queryKey: queryKeys.organizations.myRoadmaps(orgIdsKey),
    queryFn: () => fetchAllMyOrgRoadmaps(organizations, queryClient),
    enabled: !orgsLoading && organizations.length > 0,
  });

  const roadmaps = useMemo(
    () => (roadmapsQuery.data ?? []).map(attachForkMetadata),
    [roadmapsQuery.data],
  );

  return {
    roadmaps,
    organizations,
    loading:
      orgsLoading ||
      (organizations.length > 0 && roadmapsQuery.isPending),
    error: roadmapsQuery.error
      ? getApiErrorMessage(roadmapsQuery.error)
      : null,
    reload: () => roadmapsQuery.refetch(),
  };
}
