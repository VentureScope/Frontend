"use client";

import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AdminActionBadge } from "@/components/admin/ui/AdminBadge";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { adminEmeraldBtn, adminGhostBtn, adminPage } from "@/components/admin/ui/admin-styles";
import {
  ADMIN_ACTIVITY,
  ADMIN_DAGS,
  ADMIN_OVERVIEW_STATS,
  PIPELINE_DONUT,
  type DagStatus,
} from "@/lib/admin-mock-data";

function dagStatusLabel(status: DagStatus) {
  switch (status) {
    case "success":
      return <span className="font-mono text-xs text-emerald-400">✓ success</span>;
    case "failed":
      return <span className="font-mono text-xs text-red-400">✗ failed</span>;
    default:
      return <span className="font-mono text-xs text-amber-400">● running</span>;
  }
}

export function AdminOverview() {
  const stats = ADMIN_OVERVIEW_STATS;

  return (
    <div className={adminPage}>
      {/* — Stat Cards — */}
      <div className="grid grid-cols-4 gap-3">
        <AdminStatCard
          label="Active Users"
          value={stats.activeUsers.value}
          subtext={stats.activeUsers.delta}
          subtextClassName="text-emerald-400"
        />
        <AdminStatCard
          label="Failed Embeddings"
          value={stats.failedEmbeddings.value}
          subtext={stats.failedEmbeddings.hint}
          valueClassName="text-red-400"
          subtextClassName="text-red-400"
        />
        <AdminStatCard
          label="Pending Transcripts"
          value={stats.pendingTranscripts.value}
          subtext={stats.pendingTranscripts.hint}
          valueClassName="text-amber-400"
          subtextClassName="text-amber-400"
        />
        <AdminStatCard
          label="AI Chats Today"
          value={stats.aiChatsToday.value}
          subtext={stats.aiChatsToday.delta}
        />
      </div>

      {/* — Activity + Donut — */}
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3 border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-sm font-medium text-white">Recent Activity</span>
            <Link href="/admin/directory" className="text-xs text-zinc-500 hover:text-white">
              View All →
            </Link>
          </div>
          <ul>
            {ADMIN_ACTIVITY.map((row) => (
              <li
                key={row.id}
                className="flex items-center gap-3 border-b border-zinc-800/50 py-2 text-xs"
              >
                <span className="w-20 shrink-0 font-mono text-zinc-500">{row.time}</span>
                <AdminActionBadge tone={row.badgeTone}>{row.badge}</AdminActionBadge>
                <span className="text-zinc-300">
                  <span className="text-zinc-400">{row.actor}</span> → {row.target}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 border border-zinc-800 bg-zinc-900 p-4">
          <p className="mb-2 text-sm font-medium text-white">Pipeline Health</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIPELINE_DONUT}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  stroke="none"
                >
                  {PIPELINE_DONUT.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1">
            {PIPELINE_DONUT.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-xs text-zinc-400">
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
        </div>
      </div>

      {/* — DAG Table — */}
      <div>
        <div className="mb-2 flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-sm font-medium text-white">DAG Pipeline Status</span>
          <a
            href="https://airflow.internal"
            target="_blank"
            rel="noopener noreferrer"
            className={adminGhostBtn}
          >
            → Open Airflow Dashboard
          </a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {["DAG Name", "Last Run", "Status", "Duration", "Action"].map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_DAGS.map((dag) => (
              <tr
                key={dag.name}
                className="border-b border-zinc-800/50 odd:bg-zinc-900 transition-colors hover:bg-zinc-800/40"
              >
                <td className="px-3 py-2 font-mono text-xs text-zinc-300">{dag.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-400">{dag.lastRun}</td>
                <td className="px-3 py-2">{dagStatusLabel(dag.status)}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-400">{dag.duration}</td>
                <td className="px-3 py-2">
                  <a
                    href={dag.airflowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Open in Airflow ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
