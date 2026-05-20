export type MlRunStatus =
  | "training"
  | "awaiting_review"
  | "deployed"
  | "superseded"
  | "failed"
  | string;

export interface MlRunRow {
  id: string;
  model_type: string;
  status: MlRunStatus;
  created_at: string;
  accuracy: string | null;
  metrics_summary: string | null;
}

export interface MlRunListResponse {
  items: MlRunRow[];
  total: number;
  page: number;
  pages: number;
}
