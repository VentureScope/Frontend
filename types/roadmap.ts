export interface ResourceOut {
  id: string;
  title: string;
  url?: string | null;
  resource_type?: string | null;
  source?: string | null;
}

export interface StepProgressOut {
  status: string;
  completed_at?: string | null;
  notes?: string | null;
}

export interface StepOut {
  id: string;
  week_number: number;
  topic: string;
  description?: string | null;
  status: string;
  resources?: ResourceOut[];
  progress?: StepProgressOut | null;
}

export interface RoadmapListItem {
  id: string;
  title: string;
  trend_name?: string | null;
  total_weeks: number;
  status: string;
  created_at: string;
}

export interface RoadmapOut {
  id: string;
  title: string;
  trend_name?: string | null;
  goal?: string | null;
  total_weeks: number;
  status: string;
  created_at: string;
  steps?: StepOut[];
}

export interface RoadmapGenerateRequest {
  trend_name: string;
  goal?: string | null;
}

export interface StepProgressUpdate {
  status: string;
  notes?: string | null;
}

export type StepResourceUiStatus = "completed" | "in-progress" | "locked";

/** Normalize API progress strings (e.g. `not_started`, `in_progress`, `completed`). */
function normalizeProgressStatus(
  status: string | null | undefined,
): "completed" | "in_progress" | "not_started" | "other" {
  if (!status) {
    return "not_started";
  }
  const n = status.toLowerCase().replace(/-/g, "_");
  if (n === "completed") {
    return "completed";
  }
  if (n === "in_progress") {
    return "in_progress";
  }
  if (n === "not_started" || n === "pending") {
    return "not_started";
  }
  return "other";
}

/**
 * Maps API step + step.progress to UI resource/module status.
 * API uses `progress.status`: not_started | in_progress | completed.
 */
export function stepUiStatus(step: StepOut): StepResourceUiStatus {
  const p = normalizeProgressStatus(step.progress?.status);
  if (p === "completed") {
    return "completed";
  }
  if (p === "in_progress") {
    return "in-progress";
  }
  return "locked";
}

export function stepProgressDone(step: StepOut): boolean {
  return normalizeProgressStatus(step.progress?.status) === "completed";
}
