import { Skeleton } from "@/components/ui/skeleton";
import { DataHubSummarySkeleton } from "@/components/data-hub/DataHubSkeletons";
import type { DataHubSourceStatus } from "@/lib/data-hub-utils";

function statusBadgeClass(status: DataHubSourceStatus["status"]) {
  return status === "synced"
    ? "vs-badge vs-badge-success"
    : "vs-badge bg-muted text-muted-foreground";
}

function statusLabel(status: DataHubSourceStatus["status"]) {
  return status === "synced" ? "Synced" : "Not connected";
}

type DataHubSummaryProps = {
  sources: DataHubSourceStatus[];
  completionPercent: number;
  loading?: boolean;
};

export default function DataHubSummary({
  sources,
  completionPercent,
  loading,
}: DataHubSummaryProps) {
  if (loading) {
    return <DataHubSummarySkeleton />;
  }

  return (
    <section className="mb-8 space-y-4">
      <div className="vs-surface flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-label text-primary">Profile completeness</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {completionPercent}% connected
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sync GitHub, transcripts, CV, and skills to improve resumes and job
            matching.
          </p>
        </div>
        <div className="w-full sm:w-48">
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-lg bg-primary transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                {source.label}
              </p>
              <span className={statusBadgeClass(source.status)}>
                {statusLabel(source.status)}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{source.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
