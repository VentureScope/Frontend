"use client";

import Link from "next/link";
import { AdminOverviewSkeleton } from "@/components/admin/AdminSkeletons";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AdminActionBadge } from "@/components/admin/ui/AdminBadge";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { DagStatusLabel } from "@/components/admin/ui/admin-status";
import {
  adminGhostBtn,
  adminPage,
  adminTableRow,
  adminTableTh,
} from "@/components/admin/ui/admin-styles";
import { useAdminOverview } from "@/hooks/useAdminOverview";

const DONUT_COLORS: Record<string, string> = {
  Success: "var(--chart-1)",
  Running: "var(--warning)",
  Failed: "var(--destructive)",
};

export function AdminOverview() {
  const { stats, activity, donut, dags, unreadAlerts, loading, error, reload } =
    useAdminOverview();

  return (
    <div className={adminPage}>
      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Platform activity at a glance.
        </p>
        <button
          type="button"
          onClick={() => void reload()}
          disabled={loading}
          className={adminGhostBtn}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <AdminOverviewSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3">
            <AdminStatCard
              label="Active Users"
              value={stats.activeUsers.value}
              subtext={stats.activeUsers.subtext}
              subtextClassName="text-primary"
            />
            <Link href="/admin/embeddings" className="block">
              <AdminStatCard
                label="Failed ML Runs"
                value={stats.failedMlRuns.value}
                subtext={stats.failedMlRuns.hint}
                valueClassName="text-destructive"
                subtextClassName="text-destructive"
              />
            </Link>
            <Link href="/admin/system" className="block">
              <AdminStatCard
                label="Running DAGs"
                value={stats.runningDags.value}
                subtext={stats.runningDags.hint}
                valueClassName="text-warning"
                subtextClassName="text-warning"
              />
            </Link>
            <AdminStatCard
              label="AI Chats Today"
              value={stats.aiChatsToday.value}
              subtext={stats.aiChatsToday.delta}
              subtextClassName="text-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm font-medium text-foreground">Recent Activity</span>
                <Link href="/admin/alerts" className="text-xs text-muted-foreground hover:text-foreground">
                  View alerts
                  {unreadAlerts > 0 ? ` (${unreadAlerts})` : ""} →
                </Link>
              </div>
              {activity.length === 0 ? (
                <p className="py-6 text-sm text-muted-foreground">No notifications yet.</p>
              ) : (
                <ul>
                  {activity.map((row) => (
                    <li
                      key={row.id}
                      className="flex items-center gap-3 border-b border-border/60 py-2 text-xs"
                    >
                      <span className="w-20 shrink-0 font-mono text-muted-foreground">
                        {row.time}
                      </span>
                      <AdminActionBadge tone={row.badgeTone}>{row.badge}</AdminActionBadge>
                      <span className="text-foreground">
                        <span className="text-muted-foreground">{row.actor}</span> → {row.target}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-span-2 border border-border bg-card p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Pipeline Health</p>
              {donut.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
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
                            <Cell
                              key={entry.name}
                              fill={DONUT_COLORS[entry.name] ?? entry.color}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {donut.map((s) => (
                      <li
                        key={s.name}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: DONUT_COLORS[s.name] ?? s.color,
                          }}
                        />
                        {s.name}
                        <span className="ml-auto font-mono text-foreground">
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
            <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
              <span className="text-sm font-medium text-foreground">DAG Pipeline Status</span>
              <Link href="/admin/system" className={adminGhostBtn}>
                Technical health →
              </Link>
            </div>
            {dags.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">No pipeline DAGs returned.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["DAG Name", "Last Run", "Status", "Duration", "Action"].map(
                      (col) => (
                        <th key={col} className={adminTableTh}>
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
                      className={adminTableRow}
                    >
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {dag.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {dag.lastRun}
                      </td>
                      <td className="px-3 py-2">
                        <DagStatusLabel status={dag.status} />
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {dag.duration}
                      </td>
                      <td className="px-3 py-2">
                        {dag.airflowUrl ? (
                          <a
                            href={dag.airflowUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Open in Airflow ↗
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
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
