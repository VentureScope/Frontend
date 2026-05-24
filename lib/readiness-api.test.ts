import { describe, expect, it } from "vitest";
import {
  normalizeUserReadiness,
  parseReadinessScore,
} from "@/lib/readiness-api";

describe("parseReadinessScore", () => {
  it("reads overall_score from API payload", () => {
    expect(parseReadinessScore({ overall_score: 25 })).toBe(25);
  });

  it("reads readiness_score from legacy payload", () => {
    expect(parseReadinessScore({ readiness_score: 72.4 })).toBe(72);
  });

  it("clamps to 0–100", () => {
    expect(parseReadinessScore({ overall_score: 140 })).toBe(100);
  });
});

describe("normalizeUserReadiness", () => {
  it("maps full readiness response", () => {
    const result = normalizeUserReadiness({
      career_interest: "Data Science",
      overall_score: 25,
      level: "Beginner",
      matched_skills: ["Communication"],
      missing_skills: ["Python"],
      transferable_skills: ["Time Management"],
      top_recommendations: ["Learn Python"],
      market_context: {
        role_demand: "high",
        top_required_skills: ["Python", "SQL"],
      },
      summary: "Build technical depth.",
      cached: false,
      cached_at: "2026-05-24T17:02:34.855173+00:00",
    });

    expect(result.overall_score).toBe(25);
    expect(result.level).toBe("Beginner");
    expect(result.missing_skills).toEqual(["Python"]);
    expect(result.market_context.role_demand).toBe("high");
    expect(result.summary).toBe("Build technical depth.");
  });
});
