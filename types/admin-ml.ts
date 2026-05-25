export type MlRunStatus =
  | "training"
  | "awaiting_review"
  | "deployed"
  | "superseded"
  | "suspended"
  | "failed"
  | string;

export type MlRunDetailField = {
  label: string;
  value: string;
};

export type MlRunDetailSection = {
  title: string;
  fields: MlRunDetailField[];
};

export interface MlRunRow {
  id: string;
  model_type: string;
  status: MlRunStatus;
  created_at: string;
  accuracy: string | null;
  /** One-line preview for tooltips; full detail is in `detail`. */
  metrics_summary: string | null;
  /** Grouped fields for the summary modal. */
  detail: MlRunDetailSection[];
  has_summary: boolean;
}

export interface MlRunListResponse {
  items: MlRunRow[];
  total: number;
  page: number;
  pages: number;
}
