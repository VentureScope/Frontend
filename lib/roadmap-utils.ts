import type { RoadmapListItem, StepOut } from "@/types/roadmap";
import { stepProgressDone } from "@/types/roadmap";

export type RoadmapDisplayStatus = "not_started" | "in_progress" | "completed";

function normalizeStatus(
  status: string | null | undefined,
): string {
  return (status ?? "").toLowerCase().replace(/-/g, "_");
}

function stepInProgress(step: StepOut): boolean {
  return normalizeStatus(step.progress?.status) === "in_progress";
}

/**
 * Derive UI status from completion stats and step progress.
 * Ignores misleading API `status` (e.g. "completed" at 0%).
 */
export function resolveRoadmapDisplayStatus(input: {
  status?: string;
  completion_percentage?: number;
  steps_completed?: number;
  total_steps?: number;
  steps?: StepOut[];
}): RoadmapDisplayStatus {
  const total = input.total_steps ?? input.steps?.length ?? 0;
  const completed = input.steps_completed ?? 0;
  const pct = input.completion_percentage ?? 0;

  if (pct >= 100 || (total > 0 && completed >= total)) {
    return "completed";
  }

  const steps = input.steps ?? [];
  const anyInProgress = steps.some(stepInProgress);
  const anyStepDone = steps.some(stepProgressDone);

  if (pct > 0 || completed > 0 || anyInProgress || anyStepDone) {
    return "in_progress";
  }

  return "not_started";
}

export function formatRoadmapStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function roadmapStatusBadgeClass(status: string): string {
  const n = status.toLowerCase();
  if (n === "completed") {
    return "vs-badge vs-badge-success";
  }
  if (n === "in_progress") {
    return "vs-badge vs-badge-accent";
  }
  return "vs-badge bg-muted text-muted-foreground";
}

export function formatRoadmapListFocus(item: RoadmapListItem): string {
  const parts: string[] = [];
  const trend = item.trend_name?.trim();
  if (trend) {
    parts.push(trend);
  }
  parts.push(
    `${item.total_weeks} week${item.total_weeks === 1 ? "" : "s"}`,
  );
  const totalSteps = item.total_steps ?? 0;
  if (totalSteps > 0) {
    parts.push(
      `${item.steps_completed ?? 0}/${totalSteps} steps complete`,
    );
  }
  return parts.join(" · ");
}

export function iconNameForTrend(trendName: string | null | undefined): string {
  const t = (trendName ?? "").toLowerCase();
  if (
    t.includes("cloud") ||
    t.includes("devops") ||
    t.includes("platform") ||
    t.includes("architect")
  ) {
    return "Cloud";
  }
  return "BarChart3";
}
