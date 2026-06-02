"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchOrganizationRoadmapDetail } from "@/lib/queries/organization-roadmap-detail";
import type { OrganizationMember } from "@/types/organization-profile";

type UseOrganizationRoadmapDetailQueryOptions = {
  members: OrganizationMember[];
  roadmapsListRaw: unknown;
  enabled?: boolean;
};

export function useOrganizationRoadmapDetailQuery(
  orgId: string,
  roadmapId: string,
  {
    members,
    roadmapsListRaw,
    enabled = true,
  }: UseOrganizationRoadmapDetailQueryOptions,
) {
  return useQuery({
    queryKey: queryKeys.organizations.roadmapDetail(orgId, roadmapId),
    queryFn: () =>
      fetchOrganizationRoadmapDetail(
        orgId,
        roadmapId,
        members,
        roadmapsListRaw,
      ),
    enabled:
      enabled && Boolean(orgId) && Boolean(roadmapId) && roadmapsListRaw != null,
  });
}
