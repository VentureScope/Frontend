"use client";

import { useCallback, useEffect, useState } from "react";
import { listAdminMlRuns } from "@/lib/admin-ml-api";
import { listAdminNotifications } from "@/lib/admin-notifications-api";
import { getAdminPipelineStatus } from "@/lib/admin-system-api";
import { listAdminUsers } from "@/lib/admin-users-api";
import {
  buildPipelineDonutFromDags,
  notificationsToActivity,
  type OverviewActivityRow,
  type PipelineDonutSlice,
} from "@/lib/admin-response-parsers";
import { getAdminApiErrorMessage } from "@/lib/admin-utils";
import type { AdminDagStatusRow } from "@/types/admin-system";

export type OverviewStats = {
  activeUsers: { value: string; subtext: string };
  failedEmbeddings: { value: string; hint: string };
  pendingTranscripts: { value: string; hint: string };
  aiChatsToday: { value: string; delta: string };
};

const EMPTY_STATS: OverviewStats = {
  activeUsers: { value: "—", subtext: "Loading…" },
  failedEmbeddings: { value: "—", hint: "" },
  pendingTranscripts: { value: "—", hint: "" },
  aiChatsToday: { value: "—", delta: "No admin API" },
};

function estimateActiveUsers(
  total: number,
  sample: { is_active: boolean }[],
): { value: string; subtext: string } {
  if (sample.length === 0) {
    return { value: String(total), subtext: `${total} accounts` };
  }
  const activeInSample = sample.filter((u) => u.is_active).length;
  const ratio = activeInSample / sample.length;
  const estimated = Math.round(total * ratio);
  const inactive = total - estimated;
  return {
    value: estimated.toLocaleString(),
    subtext:
      inactive > 0
        ? `${inactive.toLocaleString()} inactive`
        : "All active in sample",
  };
}

export function useAdminOverview() {
  const [stats, setStats] = useState<OverviewStats>(EMPTY_STATS);
  const [activity, setActivity] = useState<OverviewActivityRow[]>([]);
  const [donut, setDonut] = useState<PipelineDonutSlice[]>([]);
  const [dags, setDags] = useState<AdminDagStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, failedMlRes, notifRes, dagsRes] = await Promise.allSettled([
        listAdminUsers({ page: 1, per_page: 100, include_inactive: true }),
        listAdminMlRuns({ status: "failed", page: 1, per_page: 1 }),
        listAdminNotifications({ page: 1, per_page: 12 }),
        getAdminPipelineStatus(),
      ]);

      const users =
        usersRes.status === "fulfilled" ? usersRes.value : null;
      const failedMl =
        failedMlRes.status === "fulfilled" ? failedMlRes.value : null;
      const notifications =
        notifRes.status === "fulfilled" ? notifRes.value : null;
      const dagList = dagsRes.status === "fulfilled" ? dagsRes.value : [];

      setDags(dagList);
      setDonut(buildPipelineDonutFromDags(dagList));
      setActivity(
        notifications
          ? notificationsToActivity(notifications.items, 8)
          : [],
      );

      const transcriptDags = dagList.filter((d) =>
        d.name.toLowerCase().includes("transcript"),
      );
      const pendingTranscript = transcriptDags.filter(
        (d) => d.status === "running",
      ).length;
      const failedTranscript = transcriptDags.filter(
        (d) => d.status === "failed",
      ).length;

      setStats({
        activeUsers: users
          ? estimateActiveUsers(users.total, users.items)
          : { value: "—", subtext: "Unavailable" },
        failedEmbeddings: {
          value: String(failedMl?.total ?? 0),
          hint: failedMl && failedMl.total > 0 ? "View ML runs →" : "None failed",
        },
        pendingTranscripts: {
          value: String(pendingTranscript),
          hint:
            failedTranscript > 0
              ? `${failedTranscript} DAG failed`
              : "From pipeline status",
        },
        aiChatsToday: {
          value: "—",
          delta: "Member-scoped API only",
        },
      });
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    stats,
    activity,
    donut,
    dags,
    loading,
    error,
    reload: load,
  };
}
