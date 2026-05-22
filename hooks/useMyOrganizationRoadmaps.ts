"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { isPersonalFork } from "@/lib/organization-roadmap-fork";
import { parseOrganizationRoadmapList } from "@/lib/organization-roadmap-parsers";
import { loadOrganizationRoadmaps } from "@/lib/organization-roadmaps-storage";
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
  const [forkVersion, setForkVersion] = useState(0);
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
      setForkVersion((v) => v + 1);
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

  const roadmaps = useMemo(() => {
    void forkVersion;
    const forks = loadOrganizationRoadmaps().filter(isPersonalFork);
    const byId = new Map<string, OrganizationRoadmap>();
    for (const r of apiRoadmaps) {
      byId.set(`${r.orgId}:${r.id}`, r);
    }
    for (const r of forks) {
      byId.set(`${r.orgId}:${r.id}`, r);
    }
    return Array.from(byId.values());
  }, [apiRoadmaps, forkVersion]);

  return {
    roadmaps,
    organizations,
    loading: loading || orgsLoading,
    error,
    reload,
    refreshForks: () => setForkVersion((v) => v + 1),
  };
}
