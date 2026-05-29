"use client";

import { useMemo } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { useOrganizationDetailQuery } from "@/hooks/queries/use-organization-detail-query";
import {
  toOrganizationHubSummary,
  type OrganizationHubSummary,
} from "@/lib/organization-response-parsers";

export function useOrganization(orgId: string | undefined) {
  const query = useOrganizationDetailQuery(orgId);

  const organization = useMemo((): OrganizationHubSummary | null => {
    if (!query.data || query.data.kind !== "ok") return null;
    return toOrganizationHubSummary(query.data.data);
  }, [query.data]);

  const notFound =
    !query.isPending &&
    !query.isError &&
    query.data?.kind === "not_found";

  return {
    organization,
    loading: query.isPending,
    error: query.error ? getApiErrorMessage(query.error) : null,
    notFound,
    reload: () => query.refetch(),
  };
}
