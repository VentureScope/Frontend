import adminApi from "@/lib/admin-api";
import { parseMlRunsList } from "@/lib/admin-response-parsers";
import type { MlRunListResponse } from "@/types/admin-ml";

export type ListMlRunsParams = {
  status?: string | null;
  model_type?: string | null;
  page?: number;
  per_page?: number;
};

export async function listAdminMlRuns(
  params: ListMlRunsParams = {},
): Promise<MlRunListResponse> {
  const res = await adminApi.get<unknown>("/api/admin/ml/runs", {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 20,
      ...(params.status ? { status: params.status } : {}),
      ...(params.model_type ? { model_type: params.model_type } : {}),
    },
  });
  return parseMlRunsList(res.data);
}

export async function getAdminMlRun(runId: string): Promise<Record<string, unknown>> {
  const res = await adminApi.get<unknown>(`/api/admin/ml/runs/${runId}`);
  return (res.data as Record<string, unknown>) ?? {};
}

export async function deployAdminMlRun(runId: string): Promise<string> {
  const res = await adminApi.post<unknown>(`/api/admin/ml/deploy/${runId}`);
  const data = res.data as Record<string, unknown> | undefined;
  return typeof data?.message === "string" ? data.message : "Deploy queued";
}

export async function triggerAdminMlTraining(): Promise<string> {
  const res = await adminApi.post<unknown>("/api/admin/ml/trigger");
  const data = res.data as Record<string, unknown> | undefined;
  return typeof data?.message === "string"
    ? data.message
    : "Training pipeline triggered";
}
