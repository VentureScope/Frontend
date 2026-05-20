export type UnmatchedRoleStatus = "pending" | "accepted" | "declined" | string;

export interface UnmatchedRoleRow {
  id: number;
  cleaned_title: string;
  raw_title: string;
  occurrences: number;
  status: UnmatchedRoleStatus;
  first_seen_at: string;
}

export interface UnmatchedRoleListResponse {
  items: UnmatchedRoleRow[];
  total: number;
  page: number;
  pages: number;
}

export interface TaxonomyRoleRow {
  id: number;
  canonical_title: string;
  created_at: string;
}

export interface TaxonomyRoleListResponse {
  items: TaxonomyRoleRow[];
  total: number;
  page: number;
  pages: number;
}
