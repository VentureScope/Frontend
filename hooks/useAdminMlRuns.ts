"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deployAdminMlRun,
  redeployAdminMlRun,
  listAdminMlRuns,
  triggerAdminMlTraining,
  type ListMlRunsParams,
} from "@/lib/admin-ml-api";
import { getAdminApiErrorMessage } from "@/lib/admin-utils";
import type { MlRunListResponse, MlRunRow } from "@/types/admin-ml";

export function useAdminMlRuns(initial: ListMlRunsParams = {}) {
  const [statusFilter, setStatusFilter] = useState<string | null>(
    initial.status ?? null,
  );
  const [page, setPage] = useState(initial.page ?? 1);
  const [data, setData] = useState<MlRunListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdminMlRuns({
        page,
        per_page: 20,
        status: statusFilter,
        model_type: initial.model_type ?? null,
      });
      setData(res);
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, initial.model_type]);

  useEffect(() => {
    void load();
  }, [load]);

  const deploy = useCallback(async (runId: string) => {
    setActionLoading(runId);
    try {
      await deployAdminMlRun(runId);
      await load();
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [load]);

  const redeploy = useCallback(async (runId: string) => {
    setActionLoading(runId);
    try {
      await redeployAdminMlRun(runId);
      await load();
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [load]);

  const triggerTraining = useCallback(async () => {
    setActionLoading("trigger");
    try {
      await triggerAdminMlTraining();
      await load();
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [load]);

  const counts = useCallback(async () => {
    try {
      const [all, failed, awaiting] = await Promise.all([
        listAdminMlRuns({ page: 1, per_page: 1 }),
        listAdminMlRuns({ page: 1, per_page: 1, status: "failed" }),
        listAdminMlRuns({ page: 1, per_page: 1, status: "awaiting_review" }),
      ]);
      return {
        total: all.total,
        failed: failed.total,
        awaiting: awaiting.total,
      };
    } catch {
      return { total: 0, failed: 0, awaiting: 0 };
    }
  }, []);

  return {
    items: (data?.items ?? []) as MlRunRow[],
    total: data?.total ?? 0,
    pages: data?.pages ?? 1,
    loading,
    error,
    statusFilter,
    setStatusFilter: (s: string | null) => {
      setPage(1);
      setStatusFilter(s);
    },
    page,
    setPage,
    reload: load,
    deploy,
    redeploy,
    triggerTraining,
    actionLoading,
    fetchCounts: counts,
  };
}
