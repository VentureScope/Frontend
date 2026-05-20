export type DagRunStatus = "success" | "failed" | "running" | "unknown";

export interface AdminDagStatusRow {
  name: string;
  lastRun: string;
  status: DagRunStatus;
  duration: string;
  airflowUrl: string | null;
}

export interface SentryIssueRow {
  title: string;
  service: string;
  timesSeen: number | string;
  lastSeen: string;
  url: string;
}

export interface SentrySparklinePoint {
  day: string;
  count: number;
}

export interface SentrySummaryView {
  unresolved24h: number;
  trendDelta: string;
  p95LatencyMs: number | string;
  apdex: number | string;
  sparkline: SentrySparklinePoint[];
  topIssues: SentryIssueRow[];
  links: {
    issues: string | null;
    performance: string | null;
    alerts: string | null;
  };
}

export interface StorageFileRow {
  name: string;
  size: string;
  modified: string;
  url?: string | null;
}

export interface StorageBucketView {
  label: string;
  files: StorageFileRow[];
  totalBytes: number | null;
  lastModified: string | null;
}

export interface StorageHealthView {
  buckets: StorageBucketView[];
  totalBytes: number | null;
}

export interface PipelineRunsChartPoint {
  label: string;
  success: number;
  failed: number;
}

export interface PipelineTaskDuration {
  task: string;
  durationSec: number;
}

export interface PipelineRunsView {
  chartPoints: PipelineRunsChartPoint[];
  taskDurations: PipelineTaskDuration[];
}
