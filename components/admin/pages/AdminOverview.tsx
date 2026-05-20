"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AdminActionBadge } from "@/components/admin/ui/AdminBadge";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { adminGhostBtn, adminPage } from "@/components/admin/ui/admin-styles";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import type { DagRunStatus } from "@/types/admin-system";

function dagStatusLabel(status: DagRunStatus) {
  switch (status) {
    case "success":
      return <span className="font-mono text-xs text-emerald-400">✓ success</span>;
    case "failed":
      return <span className="font-mono text-xs text-red-400">✗ failed</span>;
    case "running":
      return <span className="font-mono text-xs text-amber-400">● running</span>;
    default:
      return <span className="font-mono text-xs text-zinc-500">— unknown</span>;
  }
}

export function AdminOverview() {
  const { stats, activity, donut, dags, loading, error, reload } =
    useAdminOverview();

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          Live metrics from admin users, ML runs, notifications, and pipeline APIs.
        </p>
        <button type="button" onClick={() => void reload()} className={adminGhostBtn}>
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading overview…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3">
            <AdminStatCard
              label="Active Users"
              value={stats.activeUsers.value}
              subtext={stats.activeUsers.subtext}
              subtextClassName="text-emerald-400"
            />
            <Link href="/admin/embeddings" className="block">
              <AdminStatCard
                label="Failed ML Runs"
                value={stats.failedEmbeddings.value}
                subtext={stats.failedEmbeddings.hint}
                valueClassName="text-red-400"
                subtextClassName="text-red-400"
              />
            </Link>
            <Link href="/admin/transcripts" className="block">
              <AdminStatCard
                label="Pending Transcripts"
                value={stats.pendingTranscripts.value}
                subtext={stats.pendingTranscripts.hint}
                valueClassName="text-amber-400"
                subtextClassName="text-amber-400"
              />
            </Link>
            <AdminStatCard
              label="AI Chats Today"
              value={stats.aiChatsToday.value}
              subtext={stats.aiChatsToday.delta}
              subtextClassName="text-zinc-500"
            />
          </div>

          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-3 flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-sm font-medium text-white">Recent Activity</span>
                <Link href="/admin/alerts" className="text-xs text-zinc-500 hover:text-white">
                  View alerts →
                </Link>
              </div>
              {activity.length === 0 ? (
                <p className="py-6 text-sm text-zinc-500">No notifications yet.</p>
              ) : (
                <ul>
                  {activity.map((row) => (
                    <li
                      key={row.id}
                      className="flex items-center gap-3 border-b border-zinc-800/50 py-2 text-xs"
                    >
                      <span className="w-20 shrink-0 font-mono text-zinc-500">
                        {row.time}
                      </span>
                      <AdminActionBadge tone={row.badgeTone}>{row.badge}</AdminActionBadge>
                      <span className="text-zinc-300">
                        <span className="text-zinc-400">{row.actor}</span> → {row.target}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-span-2 border border-zinc-800 bg-zinc-900 p-4">
              <p className="mb-2 text-sm font-medium text-white">Pipeline Health</p>
              {donut.length === 0 ? (
                <p className="py-12 text-center text-sm text-zinc-500">
                  No DAG status data.
                </p>
              ) : (
                <>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donut}
                          dataKey="value"
                          innerRadius={60}
                          outerRadius={90}
                          stroke="none"
                        >
                          {donut.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {donut.map((s) => (
                      <li
                        key={s.name}
                        className="flex items-center gap-2 text-xs text-zinc-400"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        {s.name}
                        <span className="ml-auto font-mono text-zinc-300">
                          {s.value.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-sm font-medium text-white">DAG Pipeline Status</span>
              <Link href="/admin/system" className={adminGhostBtn}>
                Technical health →
              </Link>
            </div>
            {dags.length === 0 ? (
              <p className="py-6 text-sm text-zinc-500">No pipeline DAGs returned.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["DAG Name", "Last Run", "Status", "Duration", "Action"].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                        >
                          {col}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dags.map((dag) => (
                    <tr
                      key={dag.name}
                      className="border-b border-zinc-800/50 odd:bg-zinc-900 transition-colors hover:bg-zinc-800/40"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-zinc-300">
                        {dag.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                        {dag.lastRun}
                      </td>
                      <td className="px-3 py-2">{dagStatusLabel(dag.status)}</td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                        {dag.duration}
                      </td>
                      <td className="px-3 py-2">
                        {dag.airflowUrl ? (
                          <a
                            href={dag.airflowUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-400 hover:text-white"
                          >
                            Open in Airflow ↗
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
