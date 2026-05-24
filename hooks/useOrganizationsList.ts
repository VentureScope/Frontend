"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { cacheOrganizationName } from "@/lib/organization-label-cache";
import { listMyOrganizations } from "@/lib/organizations-api";
import { parseOrganizationListItems } from "@/lib/organization-response-parsers";
import type { OrganizationListItem } from "@/types/organization";

export function useOrganizationsList() {
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMyOrganizations();
      const items = parseOrganizationListItems(data);
      for (const org of items) {
        cacheOrganizationName(org.id, org.name);
      }
      setOrganizations(items);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { organizations, loading, error, reload };
}
