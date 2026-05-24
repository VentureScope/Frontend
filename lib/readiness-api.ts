import api from "@/lib/api";
import type { UserReadinessOut } from "@/types/readiness";

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
      row.readiness_score ?? row.score ?? row.readiness_percentage;
    if (typeof score === "number" && !Number.isNaN(score)) {
      return clampScore(score);
    }
  }

  return 0;
}

/** Current user's learning readiness (0–100). */
export async function getUserReadiness(): Promise<UserReadinessOut> {
  const res = await api.get<UserReadinessOut>("/api/users/me/readiness");
  return {
    readiness_score: parseReadinessScore(res.data),
  };
}
