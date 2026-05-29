"use client";

import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";
import { fetchMyOrganizations } from "@/lib/queries/organizations";

export function useOrganizationsList() {
  const query = useQuery({
    queryKey: queryKeys.organizations.mine(),
    queryFn: fetchMyOrganizations,
  });

  return {
    organizations: query.data ?? [],
    loading: query.isPending,
    error: query.error ? getApiErrorMessage(query.error) : null,
    reload: () => query.refetch(),
  };
}
