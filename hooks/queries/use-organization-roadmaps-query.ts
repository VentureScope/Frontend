"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchOrganizationRoadmapsRaw } from "@/lib/queries/organization-roadmaps";

export function useOrganizationRoadmapsQuery(orgId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.roadmaps(orgId),
    queryFn: () => fetchOrganizationRoadmapsRaw(orgId),
    enabled: Boolean(orgId),
  });
}
