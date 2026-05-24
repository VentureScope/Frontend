export type ReadinessLevel =
  | "Beginner"
  | "Developing"
  | "Intermediate"
  | "Advanced"
  | string;

export interface ReadinessMarketContext {
  role_demand: string;
  top_required_skills: string[];
}

/** Response from GET /api/users/me/readiness */
export interface UserReadiness {
  career_interest: string | null;
  overall_score: number;
  level: ReadinessLevel;
  matched_skills: string[];
  missing_skills: string[];
  transferable_skills: string[];
  top_recommendations: string[];
  market_context: ReadinessMarketContext;
  summary: string;
  cached: boolean;
  cached_at: string | null;
}

/** @deprecated Use {@link UserReadiness} */
export interface UserReadinessOut {
  readiness_score: number;
}
