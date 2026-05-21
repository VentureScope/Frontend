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
  failedMlRuns: { value: string; hint: string };
  runningDags: { value: string; hint: string };
  aiChatsToday: { value: string; delta: string };
};

const EMPTY_STATS: OverviewStats = {
  activeUsers: { value: "—", subtext: "Loading…" },
  failedMlRuns: { value: "—", hint: "" },
  runningDags: { value: "—", hint: "" },
  aiChatsToday: { value: "—", delta: "No admin API" },
};

function estimateActiveUsers(
  total: number,
  sample: { is_active: boolean }[],
  perPage: number,
): { value: string; subtext: string } {
  if (total === 0) {
    return { value: "0", subtext: "No accounts" };
  }
  if (sample.length === 0) {
    return {
      value: total.toLocaleString(),
      subtext: `${total.toLocaleString()} total accounts`,
    };
  }

  const activeInSample = sample.filter((u) => u.is_active).length;
  const ratio = activeInSample / sample.length;
  const estimated = Math.round(total * ratio);
  const inactiveEst = Math.max(0, total - estimated);

  const subtext =
    sample.length < total
      ? `~${estimated.toLocaleString()} active (est. from ${Math.min(perPage, sample.length)} of ${total.toLocaleString()})`
      : inactiveEst > 0
        ? `${inactiveEst.toLocaleString()} inactive`
        : "All accounts active";

  return {
    value: estimated.toLocaleString(),
    subtext,
  };
}

function pipelineOverviewStats(dagList: AdminDagStatusRow[]) {
  const running = dagList.filter((d) => d.status === "running").length;
  const failed = dagList.filter((d) => d.status === "failed").length;
  const success = dagList.filter((d) => d.status === "success").length;

  return {
    runningDags: {
      value: String(running),
      hint:
        failed > 0
          ? `${failed} failed · ${success} success`
          : dagList.length > 0
            ? `${success} success · ${dagList.length} DAGs`
            : "No DAG status",
    },
  };
}

export function useAdminOverview() {
  const [stats, setStats] = useState<OverviewStats>(EMPTY_STATS);
  const [activity, setActivity] = useState<OverviewActivityRow[]>([]);
  const [donut, setDonut] = useState<PipelineDonutSlice[]>([]);
  const [dags, setDags] = useState<AdminDagStatusRow[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
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
      setUnreadAlerts(notifications?.unread_count ?? 0);
      setActivity(
        notifications
          ? notificationsToActivity(notifications.items, 8)
          : [],
      );

      const pipelineStats = pipelineOverviewStats(dagList);

      setStats({
        activeUsers: users
          ? estimateActiveUsers(users.total, users.items, users.per_page)
          : { value: "—", subtext: "Unavailable" },
        failedMlRuns: {
          value: String(failedMl?.total ?? 0),
          hint:
            failedMl && failedMl.total > 0
              ? "View ML runs →"
              : "No failed runs",
        },
        runningDags: pipelineStats.runningDags,
        aiChatsToday: {
          value: "—",
          delta: "No admin API",
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
    unreadAlerts,
    loading,
    error,
    reload: load,
  };
}
