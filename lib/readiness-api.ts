import api from "@/lib/api";
import type { UserReadiness } from "@/types/readiness";

function clampScore(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

export function parseReadinessScore(raw: unknown): number {
  if (typeof raw === "number" && !Number.isNaN(raw)) {
    return clampScore(raw);
  }

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const row = raw as Record<string, unknown>;
    const score =
      row.overall_score ??
      row.readiness_score ??
      row.score ??
      row.readiness_percentage;
    if (typeof score === "number" && !Number.isNaN(score)) {
      return clampScore(score);
    }
  }

  return 0;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeMarketContext(raw: unknown): UserReadiness["market_context"] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { role_demand: "unknown", top_required_skills: [] };
  }
  const row = raw as Record<string, unknown>;
  const demand =
    typeof row.role_demand === "string" && row.role_demand.trim()
      ? row.role_demand.trim()
      : "unknown";
  return {
    role_demand: demand,
    top_required_skills: asStringArray(row.top_required_skills),
  };
}

export function normalizeUserReadiness(raw: unknown): UserReadiness {
  const row =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const careerInterest =
    typeof row.career_interest === "string" ? row.career_interest.trim() : null;

  return {
    career_interest: careerInterest || null,
    overall_score: parseReadinessScore(row),
    level:
      typeof row.level === "string" && row.level.trim()
        ? row.level.trim()
        : "Beginner",
    matched_skills: asStringArray(row.matched_skills),
    missing_skills: asStringArray(row.missing_skills),
    transferable_skills: asStringArray(row.transferable_skills),
    top_recommendations: asStringArray(row.top_recommendations),
    market_context: normalizeMarketContext(row.market_context),
    summary: typeof row.summary === "string" ? row.summary.trim() : "",
    cached: Boolean(row.cached),
    cached_at:
      typeof row.cached_at === "string" && row.cached_at.trim()
        ? row.cached_at
        : null,
  };
}

/** Career readiness vs target role (cached 24h; pass refresh to recompute). */
export async function getUserReadiness(options?: {
  refresh?: boolean;
}): Promise<UserReadiness> {
  const res = await api.get<unknown>("/api/users/me/readiness", {
    params: options?.refresh ? { refresh: true } : undefined,
  });
  return normalizeUserReadiness(res.data);
}
