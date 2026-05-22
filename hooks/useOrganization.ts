"use client";

import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { cacheOrganizationName } from "@/lib/organization-label-cache";
import { getOrganization } from "@/lib/organizations-api";
import {
  parseOrganizationOutApi,
  toOrganizationHubSummary,
  type OrganizationHubSummary,
} from "@/lib/organization-response-parsers";

export function useOrganization(orgId: string | undefined) {
  const [organization, setOrganization] =
    useState<OrganizationHubSummary | null>(null);
  const [loading, setLoading] = useState(Boolean(orgId));
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const reload = useCallback(async () => {
    if (!orgId) {
      setOrganization(null);
      setLoading(false);
      setError(null);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getOrganization(orgId);
      const parsed = parseOrganizationOutApi(data);
      if (!parsed) {
        setOrganization(null);
        setNotFound(true);
        return;
      }
      const summary = toOrganizationHubSummary(parsed);
      cacheOrganizationName(orgId, summary.displayName);
      setOrganization(summary);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err);
      const status =
        err instanceof AxiosError ? err.response?.status : undefined;

      if (status === 404) {
        setNotFound(true);
        setOrganization(null);
        setError(null);
      } else {
        setError(message);
        setOrganization(null);
      }
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { organization, loading, error, notFound, reload };
}
