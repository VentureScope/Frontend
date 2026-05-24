import { describe, expect, it } from "vitest";
import { parseReadinessScore } from "@/lib/readiness-api";

describe("parseReadinessScore", () => {
  it("reads readiness_score from API payload", () => {
    expect(parseReadinessScore({ readiness_score: 72.4 })).toBe(72);
  });

  it("supports alternate field names", () => {
    expect(parseReadinessScore({ score: 88 })).toBe(88);
  });

  it("clamps to 0–100", () => {
    expect(parseReadinessScore({ readiness_score: 140 })).toBe(100);
    expect(parseReadinessScore({ readiness_score: -5 })).toBe(0);
  });

  it("returns 0 for invalid payloads", () => {
    expect(parseReadinessScore(null)).toBe(0);
    expect(parseReadinessScore({})).toBe(0);
  });
});
