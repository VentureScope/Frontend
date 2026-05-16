export interface TrendingCareer {
  name: string;
  job_count: number;
  company_count: number;
  growth_pct?: number | null;
}

export interface InDemandSkill {
  skill: string;
  demand: number;
}

export interface JobStats {
  total_jobs: number;
  unique_companies: number;
  unique_categories: number;
  date_range?: (string | null)[] | null;
}

export interface JobMatch {
  id: string;
  job_title: string;
  company_name: string;
  normalized_title: string;
  city?: string | null;
  job_type?: string | null;
  distance?: number | null;
}

export type JobByCategoryRow = Record<string, unknown>;
