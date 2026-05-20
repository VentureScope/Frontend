"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
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
import { adminGhostBtn, adminPage } from "@/components/admin/ui/admin-styles";
import { useAdminSystemHealth } from "@/hooks/useAdminSystemHealth";
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
      return <span className="font-mono text-xs text-zinc-500">—</span>;
  }
}

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-white">Transcript Pipeline</h1>
          <p className="text-sm text-zinc-500">
            Airflow DAGs whose names include transcript or parsing, from pipeline-status.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/system" className={adminGhostBtn}>
            Full system health →
          </Link>
          <button type="button" onClick={() => void reload()} className={adminGhostBtn}>
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading pipeline…
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <AdminStatCard
              label="Running"
              value={String(running)}
              valueClassName="text-amber-400"
            />
            <AdminStatCard
              label="Failed"
              value={String(failed)}
              valueClassName="text-red-400"
            />
            <AdminStatCard
              label="Success (latest)"
              value={String(success)}
              valueClassName="text-emerald-400"
            />
          </div>

          {pipelineRuns && pipelineRuns.chartPoints.length > 0 ? (
            <div className="mb-6 border border-zinc-800 bg-zinc-900 p-4">
              <p className="mb-3 text-sm font-medium text-white">
                Pipeline runs (14 days)
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineRuns.chartPoints}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid #3f3f46",
                      }}
                    />
                    <Bar dataKey="success" fill="#34d399" name="Success" />
                    <Bar dataKey="failed" fill="#f87171" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          <div className="border border-zinc-800 bg-zinc-900">
            <p className="border-b border-zinc-800 px-4 py-2 text-sm font-medium text-white">
              Transcript DAGs
            </p>
            {transcriptDags.length === 0 ? (
              <p className="px-4 py-8 text-sm text-zinc-500">
                No transcript-related DAGs in the latest status response. Showing all
                DAGs below.
              </p>
            ) : null}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["DAG", "Last run", "Status", "Duration", ""].map((col) => (
                    <th
                      key={col || "link"}
                      className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
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
                    className="border-b border-zinc-800/50 odd:bg-zinc-950"
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
