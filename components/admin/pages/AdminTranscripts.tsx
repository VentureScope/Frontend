"use client";

import Link from "next/link";
import { AdminTranscriptsSkeleton } from "@/components/admin/AdminSkeletons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { DagStatusLabel } from "@/components/admin/ui/admin-status";
import {
  adminGhostBtn,
  adminPage,
  adminPageDesc,
  adminPageTitle,
  adminSection,
  adminSectionLabel,
  adminTableRow,
  adminTableTh,
} from "@/components/admin/ui/admin-styles";
import { useAdminSystemHealth } from "@/hooks/useAdminSystemHealth";

function isTranscriptDag(name: string) {
  const n = name.toLowerCase();
  return n.includes("transcript") || n.includes("parsing");
}

export function AdminTranscripts() {
  const { dags, pipelineRuns, loading, error, reload } = useAdminSystemHealth(14);

  const transcriptDags = dags.filter((d) => isTranscriptDag(d.name));
  const running = transcriptDags.filter((d) => d.status === "running").length;
  const failed = transcriptDags.filter((d) => d.status === "failed").length;
  const success = transcriptDags.filter((d) => d.status === "success").length;

  return (
    <div className={adminPage}>
      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-foreground">Transcript Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Airflow DAGs whose names include transcript or parsing, from pipeline-status.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/system" className={adminGhostBtn}>
            Full system health →
          </Link>
          <button
            type="button"
            onClick={() => void reload()}
            disabled={loading}
            className={adminGhostBtn}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <AdminTranscriptsSkeleton />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <AdminStatCard
              label="Running"
              value={String(running)}
              valueClassName="text-warning"
            />
            <AdminStatCard
              label="Failed"
              value={String(failed)}
              valueClassName="text-destructive"
            />
            <AdminStatCard
              label="Success (latest)"
              value={String(success)}
              valueClassName="text-primary"
            />
          </div>

          {pipelineRuns && pipelineRuns.chartPoints.length > 0 ? (
            <div className="mb-6 border border-border bg-card p-4">
              <p className="mb-3 text-sm font-medium text-foreground">
                Pipeline runs (14 days)
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineRuns.chartPoints}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    />
                    <YAxis
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        color: "var(--popover-foreground)",
                      }}
                    />
                    <Bar dataKey="success" fill="var(--chart-1)" name="Success" />
                    <Bar dataKey="failed" fill="var(--destructive)" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          <div className="border border-border bg-card">
            <p className="border-b border-border px-4 py-2 text-sm font-medium text-foreground">
              Transcript DAGs
            </p>
            {transcriptDags.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">
                No transcript-related DAGs in the latest status response. Showing all
                DAGs below.
              </p>
            ) : null}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["DAG", "Last run", "Status", "Duration", ""].map((col) => (
                    <th
                      key={col || "link"}
                      className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(transcriptDags.length > 0 ? transcriptDags : dags).map((dag) => (
                  <tr
                    key={dag.name}
                    className="border-b border-border/60 odd:bg-muted/30"
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
                          Airflow ↗
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
