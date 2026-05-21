"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminPipelineRuns,
  getAdminPipelineStatus,
  getAdminSentrySummary,
  getAdminStorageHealth,
} from "@/lib/admin-system-api";
import { getAdminApiErrorMessage } from "@/lib/admin-utils";
import type {
  AdminDagStatusRow,
  PipelineRunsView,
  SentrySummaryView,
  StorageHealthView,
} from "@/types/admin-system";

export function useAdminSystemHealth(pipelineDays = 7) {
  const [dags, setDags] = useState<AdminDagStatusRow[]>([]);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRunsView | null>(
    null,
  );
  const [storage, setStorage] = useState<StorageHealthView | null>(null);
  const [sentry, setSentry] = useState<SentrySummaryView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, runsRes, storageRes, sentryRes] =
        await Promise.allSettled([
          getAdminPipelineStatus(),
          getAdminPipelineRuns(pipelineDays),
          getAdminStorageHealth(),
          getAdminSentrySummary(),
        ]);

      setDags(statusRes.status === "fulfilled" ? statusRes.value : []);
      setPipelineRuns(runsRes.status === "fulfilled" ? runsRes.value : null);
      setStorage(storageRes.status === "fulfilled" ? storageRes.value : null);
      setSentry(sentryRes.status === "fulfilled" ? sentryRes.value : null);

      const failed = [statusRes, runsRes, storageRes, sentryRes].filter(
        (r) => r.status === "rejected",
      );
      if (failed.length === 4) {
        setError(getAdminApiErrorMessage((failed[0] as PromiseRejectedResult).reason));
      }
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [pipelineDays]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    dags,
    pipelineRuns,
    storage,
    sentry,
    loading,
    error,
    reload: load,
  };
}
