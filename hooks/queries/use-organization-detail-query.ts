"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchOrganizationDetail } from "@/lib/queries/organizations";

export function useOrganizationDetailQuery(orgId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(orgId ?? ""),
    queryFn: () => fetchOrganizationDetail(orgId!),
    enabled: Boolean(orgId),
  });
}
