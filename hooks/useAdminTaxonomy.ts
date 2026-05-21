"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listTaxonomyRoles,
  listUnmatchedTaxonomyRoles,
  patchUnmatchedTaxonomyRole,
} from "@/lib/admin-taxonomy-api";
import {
  parseTaxonomyRolesList,
  parseUnmatchedRolesList,
} from "@/lib/admin-response-parsers";
import { getAdminApiErrorMessage } from "@/lib/admin-utils";
import type {
  TaxonomyRoleListResponse,
  UnmatchedRoleListResponse,
  UnmatchedRoleStatus,
} from "@/types/admin-taxonomy";

export function useAdminTaxonomy() {
  const [unmatched, setUnmatched] = useState<UnmatchedRoleListResponse | null>(
    null,
  );
  const [canonical, setCanonical] = useState<TaxonomyRoleListResponse | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<UnmatchedRoleStatus | "all">(
    "pending",
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patchingId, setPatchingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [unmatchedRaw, rolesRaw] = await Promise.all([
        listUnmatchedTaxonomyRoles({
          page,
          per_page: 50,
          ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        }),
        listTaxonomyRoles(),
      ]);
      setUnmatched(parseUnmatchedRolesList(unmatchedRaw));
      setCanonical(parseTaxonomyRolesList(rolesRaw));
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchRole = useCallback(
    async (roleId: number, status: "accepted" | "declined") => {
      setPatchingId(roleId);
      try {
        await patchUnmatchedTaxonomyRole(String(roleId), { status });
        await load();
      } catch (err) {
        setError(getAdminApiErrorMessage(err));
      } finally {
        setPatchingId(null);
      }
    },
    [load],
  );

  return {
    unmatched: unmatched?.items ?? [],
    unmatchedTotal: unmatched?.total ?? 0,
    canonical: canonical?.items ?? [],
    canonicalTotal: canonical?.total ?? 0,
    loading,
    error,
    statusFilter,
    setStatusFilter: (s: UnmatchedRoleStatus | "all") => {
      setPage(1);
      setStatusFilter(s);
    },
    page,
    setPage,
    patchingId,
    patchRole,
    reload: load,
  };
}
