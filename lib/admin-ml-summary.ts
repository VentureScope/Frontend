import type { MlRunDetailField, MlRunDetailSection } from "@/types/admin-ml";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }
  return fallback;
}

function isEmptyValue(value: unknown): boolean {
  return value == null || value === "";
}

function formatPercentMetric(key: string, value: unknown): string | null {
  if (isEmptyValue(value)) {
    return null;
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    if (value >= 0 && value <= 1) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return String(value);
  }
  const text = asString(value);
  return text || null;
}

function formatBytes(value: unknown): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  if (value < 1024) {
    return `${value} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTimestamp(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) {
    return null;
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return raw;
  }
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function field(
  label: string,
  value: string | null | undefined,
): MlRunDetailField | null {
  if (!value?.trim()) {
    return null;
  }
  return { label, value: value.trim() };
}

function section(
  title: string,
  fields: Array<MlRunDetailField | null>,
): MlRunDetailSection | null {
  const kept = fields.filter((f): f is MlRunDetailField => f != null);
  if (kept.length === 0) {
    return null;
  }
  return { title, fields: kept };
}

const METRIC_PRIORITY = [
  "accuracy",
  "val_accuracy",
  "test_accuracy",
  "f1_score",
  "f1",
  "auc_roc",
  "auc",
  "roc_auc",
  "precision",
  "recall",
  "loss",
  "val_loss",
] as const;

function humanizeKey(key: string): string {
  return key.replace(/_/g, " ");
}

function summarizeMetricsObject(
  metrics: Record<string, unknown>,
  maxParts = 4,
): string | null {
  const parts: string[] = [];
  const used = new Set<string>();

  for (const key of METRIC_PRIORITY) {
    if (!(key in metrics) || isEmptyValue(metrics[key])) {
      continue;
    }
    const formatted = formatPercentMetric(key, metrics[key]);
    if (formatted) {
      parts.push(`${humanizeKey(key)}: ${formatted}`);
      used.add(key);
    }
    if (parts.length >= maxParts) {
      break;
    }
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}

export type MlRunParsedDetail = {
  shortSummary: string | null;
  detail: MlRunDetailSection[];
  has_summary: boolean;
};

/** Build modal sections + short line from VentureScope list item shape. */
export function buildMlRunDetail(row: Record<string, unknown>): MlRunParsedDetail {
  const textFields = [
    row.metrics_summary,
    row.summary,
    row.run_summary,
    row.training_summary,
    row.result_summary,
  ];

  for (const candidate of textFields) {
    if (typeof candidate === "string" && candidate.trim()) {
      const text = candidate.trim();
      return {
        shortSummary: text,
        detail: [
          {
            title: "Summary",
            fields: [{ label: "Description", value: text }],
          },
        ],
        has_summary: true,
      };
    }
  }

  const nestedMetrics = asRecord(
    row.metrics ??
      row.metrics_json ??
      row.training_metrics ??
      row.evaluation_metrics,
  );

  const sections: MlRunDetailSection[] = [];

  const performance = section("Performance", [
    field("Accuracy", formatPercentMetric("accuracy", row.accuracy)),
    field("F1 score", formatPercentMetric("f1_score", row.f1_score)),
    field("AUC-ROC", formatPercentMetric("auc_roc", row.auc_roc)),
    field(
      "Loss",
      row.loss != null ? formatPercentMetric("loss", row.loss) : null,
    ),
  ]);
  if (performance) {
    sections.push(performance);
  }

  const dataset = section("Training data", [
    field(
      "Records",
      row.record_count != null ? asString(row.record_count) : null,
    ),
    field(
      "Months covered",
      row.months_covered != null ? asString(row.months_covered) : null,
    ),
  ]);
  if (dataset) {
    sections.push(dataset);
  }

  const artifact = section("Model artifact", [
    field("Model size", formatBytes(row.model_size_bytes)),
    field("Staging PKL key", asString(row.staging_pkl_key) || null),
  ]);
  if (artifact) {
    sections.push(artifact);
  }

  const deployment = section("Deployment", [
    field("Deployed at", formatTimestamp(row.deployed_at)),
    field("Deployed by", asString(row.deployed_by) || null),
    field(
      "Notification sent",
      formatTimestamp(row.notification_sent_at),
    ),
  ]);
  if (deployment) {
    sections.push(deployment);
  }

  const runInfo = section("Run", [
    field("Run ID", asString(row.run_id ?? row.id) || null),
    field("DAG", asString(row.dag_id) || null),
    field("Model type", asString(row.model_type ?? row.model) || null),
    field("Status", asString(row.status) || null),
    field("Created", formatTimestamp(row.created_at ?? row.started_at)),
  ]);
  if (runInfo) {
    sections.push(runInfo);
  }

  if (nestedMetrics) {
    const nestedLine = summarizeMetricsObject(nestedMetrics);
    if (nestedLine) {
      sections.unshift({
        title: "Metrics (raw)",
        fields: nestedLine.split(" · ").map((part) => {
          const idx = part.indexOf(":");
          if (idx === -1) {
            return { label: "Metric", value: part };
          }
          return {
            label: part.slice(0, idx).trim(),
            value: part.slice(idx + 1).trim(),
          };
        }),
      });
    }
  }

  const error = asString(row.error_message ?? row.error ?? row.message, "");
  if (error) {
    sections.push({
      title: "Error",
      fields: [{ label: "Message", value: error }],
    });
  }

  const metricParts: string[] = [];
  if (performance) {
    for (const f of performance.fields.slice(0, 3)) {
      metricParts.push(`${f.label}: ${f.value}`);
    }
  }

  const shortFromMetrics =
    metricParts.length > 0
      ? metricParts.join(" · ")
      : nestedMetrics
        ? summarizeMetricsObject(nestedMetrics)
        : null;

  const has_summary = sections.some(
    (s) => s.title !== "Run" && s.fields.length > 0,
  );

  return {
    shortSummary: shortFromMetrics,
    detail: sections,
    has_summary,
  };
}

/** @deprecated Use buildMlRunDetail().shortSummary */
export function formatMlRunSummary(row: Record<string, unknown>): string | null {
  return buildMlRunDetail(row).shortSummary;
}

export function splitMlRunSummaryParts(summary: string | null): string[] {
  if (!summary?.trim()) {
    return [];
  }
  return summary
    .split(/\s*·\s*|\s*\|\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function logMlRunsListDebug(
  rawResponse: unknown,
  parsedItems: { id: string; has_summary: boolean; metrics_summary: string | null }[],
): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const root = asRecord(rawResponse);
  const rawItems = Array.isArray(root?.items)
    ? root.items
    : Array.isArray(root?.runs)
      ? root.runs
      : [];

  const firstRaw = asRecord(rawItems[0]);
  const firstParsed = parsedItems[0];

  console.group("[admin/ml/runs] summary debug");
  console.log("response keys:", root ? Object.keys(root) : []);
  if (firstRaw) {
    console.log("first item:", firstRaw);
    const built = buildMlRunDetail(firstRaw);
    console.log("built has_summary:", built.has_summary);
    console.log("built shortSummary:", built.shortSummary);
    console.log("built sections:", built.detail);
  } else {
    console.log("no items in response");
  }
  console.log("parsed row:", firstParsed ?? null);
  console.groupEnd();
}
