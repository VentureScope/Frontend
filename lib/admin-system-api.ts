import adminApi from "@/lib/admin-api";
import {
  parsePipelineRuns,
  parsePipelineStatus,
  parseSentrySummary,
  parseStorageHealth,
} from "@/lib/admin-response-parsers";
import type {
  AdminDagStatusRow,
  PipelineRunsView,
  SentrySummaryView,
  StorageHealthView,
} from "@/types/admin-system";

export async function getAdminPipelineStatus(): Promise<AdminDagStatusRow[]> {
  const res = await adminApi.get<unknown>("/api/admin/system/pipeline-status");
  return parsePipelineStatus(res.data);
}

export async function getAdminPipelineRuns(
  days = 7,
): Promise<PipelineRunsView> {
  const res = await adminApi.get<unknown>("/api/admin/system/pipeline-runs", {
    params: { days },
  });
  return parsePipelineRuns(res.data, days);
}

export async function getAdminStorageHealth(): Promise<StorageHealthView> {
  const res = await adminApi.get<unknown>("/api/admin/system/storage");
  return parseStorageHealth(res.data);
}

export async function getAdminSentrySummary(): Promise<SentrySummaryView> {
  const res = await adminApi.get<unknown>("/api/admin/sentry/summary");
  return parseSentrySummary(res.data);
}
