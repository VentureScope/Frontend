"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { attachForkMetadata } from "@/lib/organization-roadmap-fork";
import { parseOrganizationRoadmapList } from "@/lib/organization-roadmap-parsers";
import {
  listMyOrganizations,
  listOrganizationRoadmaps,
} from "@/lib/organizations-api";
import { parseOrganizationListItems } from "@/lib/organization-response-parsers";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";

export function useMyOrganizationRoadmaps() {
  const { organizations, loading: orgsLoading } = useOrganizationsList();
  const [apiRoadmaps, setApiRoadmaps] = useState<OrganizationRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orgs =
        organizations.length > 0
          ? organizations
          : parseOrganizationListItems(await listMyOrganizations());

      const lists = await Promise.all(
        orgs.map(async (org) => {
          try {
            const data = await listOrganizationRoadmaps(org.id);
            return parseOrganizationRoadmapList(data, org.id, []);
          } catch {
            return [];
          }
        }),
      );

      setApiRoadmaps(lists.flat());
    } catch (err) {
      setError(getApiErrorMessage(err));
      setApiRoadmaps([]);
    } finally {
      setLoading(false);
    }
  }, [organizations]);

  useEffect(() => {
    if (!orgsLoading) {
      void reload();
    }
  }, [reload, orgsLoading]);

  const roadmaps = useMemo(
    () => apiRoadmaps.map(attachForkMetadata),
    [apiRoadmaps],
  );

  return {
    roadmaps,
    organizations,
    loading: loading || orgsLoading,
    error,
    reload,
  };
}
