import type {
  AdminNotificationItem,
  AdminNotificationListResponse,
} from "@/types/admin-notifications";
import { buildMlRunDetail } from "@/lib/admin-ml-summary";
import type { MlRunListResponse, MlRunRow } from "@/types/admin-ml";
import type {
  TaxonomyRoleListResponse,
  TaxonomyRoleRow,
  UnmatchedRoleListResponse,
  UnmatchedRoleRow,
} from "@/types/admin-taxonomy";
import type {
  AdminDagStatusRow,
  DagRunStatus,
  PipelineRunsChartPoint,
  PipelineRunsView,
  PipelineTaskDuration,
  SentryIssueRow,
  SentrySparklinePoint,
  SentrySummaryView,
  StorageBucketView,
  StorageFileRow,
  StorageHealthView,
} from "@/types/admin-system";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  return fallback;
}

function asStringOrNumber(
  value: unknown,
  fallback: string | number = "—",
): string | number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") return value;
  return fallback;
}

/** Map raw list entries, skipping nulls — avoids (T | null)[] assignability issues. */
function parseArray<T>(
  raw: unknown[],
  parseItem: (entry: unknown) => T | null,
): T[] {
  const items: T[] = [];
  for (const entry of raw) {
    const parsed = parseItem(entry);
    if (parsed !== null) {
      items.push(parsed);
    }
  }
  return items;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDuration(seconds: unknown): string {
  const sec = asNumber(seconds, -1);
  if (sec < 0) return "—";
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}

function durationFromIsoRange(start: unknown, end: unknown): string {
  const startStr = asString(start);
  const endStr = asString(end);
  if (!startStr || !endStr) return "—";
  const startMs = new Date(startStr).getTime();
  const endMs = new Date(endStr).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) return "—";
  return formatDuration((endMs - startMs) / 1000);
}

function normalizeDagStatus(state: unknown): DagRunStatus {
  const s = asString(state).toLowerCase();
  if (s === "success") return "success";
  if (s === "failed") return "failed";
  if (s === "running" || s === "queued" || s === "scheduled") return "running";
  if (s.includes("fail")) return "failed";
  if (s.includes("success")) return "success";
  if (s.includes("run") || s.includes("queue")) return "running";
  return "unknown";
}

/** Keys returned by GET /api/admin/system/pipeline-status */
const PIPELINE_STATUS_KEYS = ["etl", "training"] as const;

function mapDagRun(fallbackKey: string, raw: unknown): AdminDagStatusRow | null {
  const row = asRecord(raw);
  if (!row) return null;

  const dagId = asString(row.dag_id ?? row.dagId ?? fallbackKey, fallbackKey);
  const state = row.state ?? row.status;
  const lastRunRaw =
    row.execution_date ?? row.logical_date ?? row.end_date ?? row.start_date;

  const duration =
    row.duration_sec ?? row.duration ?? row.duration_seconds
      ? formatDuration(row.duration_sec ?? row.duration ?? row.duration_seconds)
      : durationFromIsoRange(row.start_date, row.end_date);

  const runType = asString(row.run_type, "");
  const durationLabel = runType
    ? `${duration} · ${runType}`
    : duration;

  return {
    name: dagId,
    lastRun: lastRunRaw
      ? formatAdminTimestamp(asString(lastRunRaw))
      : "—",
    status: normalizeDagStatus(state),
    duration: durationLabel,
    airflowUrl: asString(row.airflow_url ?? row.url, "") || null,
  };
}

export function parseAdminNotificationsList(
  data: unknown,
): AdminNotificationListResponse {
  const root = asRecord(data) ?? {};
  const rawItems = asArray(root.items ?? root.notifications ?? root.results);

  const items = parseArray<AdminNotificationItem>(rawItems, (entry) => {
    const row = asRecord(entry);
    if (!row) return null;
    const id = asString(row.id ?? row.notification_id);
    if (!id) return null;
    return {
      id,
      source: asString(row.source, "pipeline"),
      title: asString(row.title, "Notification"),
      body: asString(row.body ?? row.message, ""),
      is_read: asBool(row.is_read ?? row.read, false),
      created_at: asString(row.created_at ?? row.timestamp, ""),
      event_type: asString(row.event_type, "") || null,
      metadata: asRecord(row.metadata),
    };
  });

  const total = asNumber(root.total, items.length);
  const per_page = asNumber(root.per_page, items.length || 50);
  const page = asNumber(root.page, 1);
  const pages = asNumber(root.pages, Math.max(1, Math.ceil(total / per_page)));

  return {
    items,
    total,
    page,
    per_page,
    pages,
    unread_count: asNumber(root.unread_count ?? root.unread, 0),
  };
}

export function parsePipelineStatus(data: unknown): AdminDagStatusRow[] {
  const root = asRecord(data);
  if (!root) return [];

  const rows: AdminDagStatusRow[] = [];

  for (const key of PIPELINE_STATUS_KEYS) {
    if (key in root) {
      const mapped = mapDagRun(key, root[key]);
      if (mapped) rows.push(mapped);
    }
  }

  const dags = asArray(root.dags ?? root.dag_runs);
  for (const entry of dags) {
    const row = asRecord(entry);
    if (!row) continue;
    const mapped = mapDagRun(asString(row.dag_id ?? row.name, "dag"), row);
    if (mapped) rows.push(mapped);
  }

  return rows;
}

export function parsePipelineRuns(data: unknown, days = 7): PipelineRunsView {
  const root = asRecord(data) ?? {};
  const history = asArray(
    root.history ?? root.runs ?? root.dag_runs ?? root.etl_runs,
  );

  const chartPoints = parseArray<PipelineRunsChartPoint>(
    history.slice(0, days),
    (entry) => {
      const row = asRecord(entry);
      if (!row) return null;
      const state = normalizeDagStatus(row.state ?? row.status);
      const label = asString(
        row.date ?? row.execution_date ?? row.day ?? row.logical_date,
        "—",
      );
      return {
        label: label.slice(0, 10),
        success: state === "success" ? 1 : 0,
        failed: state === "failed" ? 1 : 0,
      };
    },
  );

  const tasksRaw = asArray(
    root.task_durations ?? root.tasks ?? root.latest_tasks,
  );
  const taskDurations = parseArray<PipelineTaskDuration>(tasksRaw, (entry) => {
    const row = asRecord(entry);
    if (!row) return null;
    return {
      task: asString(row.task_id ?? row.task ?? row.name, "task"),
      durationSec: asNumber(row.duration_sec ?? row.duration ?? row.seconds, 0),
    };
  });

  return { chartPoints, taskDurations };
}

export function parseSentrySummary(data: unknown): SentrySummaryView {
  const root = asRecord(data) ?? {};
  const links = asRecord(root.links ?? root.deep_links) ?? {};

  const sparkRaw = asArray(root.seven_day_sparkline ?? root.sparkline);
  const sparkline: SentrySparklinePoint[] = sparkRaw.map((entry, i) => {
    if (typeof entry === "number") {
      return { day: `D${i + 1}`, count: entry };
    }
    const row = asRecord(entry);
    if (!row) return { day: `D${i + 1}`, count: 0 };
    return {
      day: asString(row.day ?? row.date ?? `D${i + 1}`),
      count: asNumber(row.count ?? row.total ?? row.backend, 0),
    };
  });

  const issuesRaw = asArray(root.top_issues ?? root.issues);
  const topIssues = parseArray<SentryIssueRow>(issuesRaw, (entry) => {
    const row = asRecord(entry);
    if (!row) return null;
    return {
      title: asString(row.title ?? row.name, "Unknown issue"),
      service: asString(row.service ?? row.project, "—"),
      timesSeen: asStringOrNumber(
        row.times_seen ?? row.count ?? row.events,
        "—",
      ),
      lastSeen: asString(row.last_seen ?? row.lastSeen, "—"),
      url: asString(row.url ?? row.permalink, "https://sentry.io"),
    };
  });

  const trend = root.trend_delta ?? root.trend;
  const trendDelta =
    typeof trend === "number"
      ? `${trend > 0 ? "+" : ""}${trend}%`
      : asString(trend, "—");

  return {
    unresolved24h: asNumber(root.unresolved_24h ?? root.unresolved24h, 0),
    trendDelta,
    p95LatencyMs: asStringOrNumber(root.p95_latency_ms ?? root.p95, "—"),
    apdex: asStringOrNumber(root.apdex, "—"),
    sparkline,
    topIssues,
    links: {
      issues: asString(links.issues ?? links.open_issues, "") || null,
      performance: asString(links.performance, "") || null,
      alerts: asString(links.alerts, "") || null,
    },
  };
}

function parseStorageBucket(
  label: string,
  raw: unknown,
  fallbackLastModified: string | null = null,
): StorageBucketView | null {
  const row = asRecord(raw);
  if (!row) return null;

  const filesRaw = asArray(row.files ?? row.objects ?? row.items);
  const files = parseArray<StorageFileRow>(filesRaw, (entry) => {
    const f = asRecord(entry);
    if (!f) return null;
    const bytes = asNumber(f.size_bytes ?? f.bytes ?? f.size, -1);
    return {
      name: asString(f.name ?? f.key ?? f.path, "—"),
      size:
        bytes >= 0
          ? formatBytes(bytes)
          : asString(f.size ?? f.size_human, "—"),
      modified: asString(
        f.last_modified ?? f.modified ?? f.updated_at,
        "—",
      ),
      url: asString(f.url, "") || null,
    };
  });

  const count = asNumber(row.count, files.length);
  // Use run-folder count (YYYY-MM dirs) when available — 1 production run,
  // N staging runs — falls back to file count if backend doesn't send `runs`.
  const runs = asNumber(row.runs ?? row.count, count);
  const totalBytes = asNumber(
    row.total_bytes ?? row.total_size_bytes ?? row.bytes,
    -1,
  );
  const displayLabel =
    runs > 0 || row.runs != null ? `${label} (${runs})` : label;

  return {
    label: displayLabel,
    files,
    totalBytes: totalBytes >= 0 ? totalBytes : null,
    lastModified:
      asString(row.last_modified ?? row.updated_at, "") ||
      fallbackLastModified ||
      null,
  };
}

function rootStorageTotalBytes(root: Record<string, unknown>): number | null {
  const bytes = asNumber(
    root.total_size_bytes ?? root.total_bytes ?? root.total_size,
    -1,
  );
  return bytes >= 0 ? bytes : null;
}

export function parseStorageHealth(data: unknown): StorageHealthView {
  const root = asRecord(data) ?? {};
  const buckets: StorageBucketView[] = [];
  const rootLastModified = asString(root.last_modified, "") || null;

  const staging = parseStorageBucket(
    "Staging models",
    root.staging,
    rootLastModified,
  );
  const production = parseStorageBucket(
    "Production models",
    root.production,
    rootLastModified,
  );

  if (staging) buckets.push(staging);
  if (production) buckets.push(production);

  const genericFiles = asArray(root.files);
  if (genericFiles.length > 0 && buckets.length === 0) {
    buckets.push({
      label: "Object storage",
      files: parseArray<StorageFileRow>(genericFiles, (entry) => {
        const f = asRecord(entry);
        if (!f) return null;
        return {
          name: asString(f.name ?? f.key, "—"),
          size: asString(f.size, "—"),
          modified: asString(f.last_modified, "—"),
          url: asString(f.url, "") || null,
        };
      }),
      totalBytes: rootStorageTotalBytes(root),
      lastModified: rootLastModified,
    });
  }

  return {
    buckets,
    totalBytes: rootStorageTotalBytes(root),
    bucketName: asString(root.bucket, "") || null,
  };
}

export function formatAdminTimestamp(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAdminTimeShort(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function parseMlRunsList(data: unknown): MlRunListResponse {
  const root = asRecord(data) ?? {};
  const rawItems = asArray(root.items ?? root.runs ?? root.results);

  const items = parseArray<MlRunRow>(rawItems, (entry) => {
    const row = asRecord(entry);
    if (!row) return null;
    const id = asString(row.id ?? row.run_id);
    if (!id) return null;

    const metrics = asRecord(
      row.metrics ?? row.metrics_json ?? row.training_metrics,
    );
    const accuracy =
      row.accuracy ??
      metrics?.accuracy ??
      metrics?.val_accuracy ??
      metrics?.test_accuracy ??
      null;

    const { shortSummary, detail, has_summary } = buildMlRunDetail(row);

    return {
      id,
      model_type: asString(row.model_type ?? row.model, "—"),
      status: asString(row.status, "unknown"),
      created_at: asString(row.created_at ?? row.started_at, ""),
      accuracy: accuracy != null ? asString(accuracy) : null,
      run_yearmonth: asString(row.run_yearmonth, "") || null,
      metrics_summary: shortSummary,
      detail,
      has_summary,
    };
  });

  const total = asNumber(root.total, items.length);
  const per_page = asNumber(root.per_page, 20);
  const page = asNumber(root.page, 1);
  const pages = asNumber(
    root.pages,
    per_page > 0 ? Math.max(1, Math.ceil(total / per_page)) : 1,
  );

  return {
    items,
    total,
    page,
    pages,
  };
}

export type PipelineDonutSlice = {
  name: string;
  value: number;
  color: string;
};

export function buildPipelineDonutFromDags(
  dags: AdminDagStatusRow[],
): PipelineDonutSlice[] {
  const success = dags.filter((d) => d.status === "success").length;
  const running = dags.filter((d) => d.status === "running").length;
  const failed = dags.filter((d) => d.status === "failed").length;
  const slices: PipelineDonutSlice[] = [
    { name: "Success", value: success, color: "#34d399" },
    { name: "Running", value: running, color: "#fbbf24" },
    { name: "Failed", value: failed, color: "#f87171" },
  ];
  return slices.filter((s) => s.value > 0);
}

export type OverviewActivityRow = {
  id: string;
  time: string;
  badge: string;
  badgeTone: "emerald" | "red" | "amber";
  actor: string;
  target: string;
};

export function parseUnmatchedRolesList(data: unknown): UnmatchedRoleListResponse {
  const root = asRecord(data) ?? {};
  const rawItems = asArray(root.items ?? root.roles ?? root.results);

  const items = parseArray<UnmatchedRoleRow>(rawItems, (entry) => {
    const row = asRecord(entry);
    if (!row) return null;
    const id = asNumber(row.id ?? row.role_id, 0);
    if (!id) return null;
    return {
      id,
      cleaned_title: asString(row.cleaned_title ?? row.title, "—"),
      raw_title: asString(row.raw_title ?? row.original_title, "—"),
      occurrences: asNumber(row.occurrences, 0),
      status: asString(row.status, "pending"),
      first_seen_at: asString(row.first_seen_at ?? row.created_at, ""),
    };
  });

  const total = asNumber(root.total, items.length);
  const per_page = asNumber(root.per_page, 50);

  return {
    items,
    total,
    page: asNumber(root.page, 1),
    pages: asNumber(root.pages, Math.max(1, Math.ceil(total / per_page))),
  };
}

export function parseTaxonomyRolesList(data: unknown): TaxonomyRoleListResponse {
  const root = asRecord(data) ?? {};
  const rawItems = asArray(root.items ?? root.roles ?? root.results);

  const items = parseArray<TaxonomyRoleRow>(rawItems, (entry) => {
    const row = asRecord(entry);
    if (!row) return null;
    const id = asNumber(row.id, 0);
    if (!id) return null;
    return {
      id,
      canonical_title: asString(
        row.canonical_title ?? row.title ?? row.name,
        "—",
      ),
      created_at: asString(row.created_at, ""),
    };
  });

  const total = asNumber(root.total, items.length);
  const per_page = asNumber(root.per_page, 50);

  return {
    items,
    total,
    page: asNumber(root.page, 1),
    pages: asNumber(root.pages, Math.max(1, Math.ceil(total / per_page))),
  };
}

export function notificationsToActivity(
  items: AdminNotificationItem[],
  limit = 8,
): OverviewActivityRow[] {
  return items.slice(0, limit).map((item) => {
    const tone: OverviewActivityRow["badgeTone"] =
      item.source === "sentry"
        ? "red"
        : item.source === "pipeline"
          ? "amber"
          : "emerald";
    return {
      id: item.id,
      time: formatAdminTimeShort(item.created_at),
      badge: item.source.toUpperCase(),
      badgeTone: tone,
      actor: item.event_type ?? item.source,
      target: item.title,
    };
  });
}
