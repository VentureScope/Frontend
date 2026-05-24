import { describe, expect, it } from "vitest";
import {
  displayRoadmapGoal,
  isInternalOrgRoadmapGoal,
  parseRoadmapSummaryBullets,
} from "@/lib/roadmap-display-utils";

describe("roadmap-display-utils", () => {
  it("detects org wizard generation goals", () => {
    const goal =
      "Organization: VC-tech. Industry: Technology & Software. Focus practice area: Data Science.";
    expect(isInternalOrgRoadmapGoal(goal)).toBe(true);
    expect(displayRoadmapGoal(goal)).toBeNull();
  });

  it("keeps user-facing goals", () => {
    expect(displayRoadmapGoal("Become proficient in ML ops")).toBe(
      "Become proficient in ML ops",
    );
  });

  it("parses multiline summaries into bullets", () => {
    expect(
      parseRoadmapSummaryBullets(
        "- Learn Python basics\n- Build a portfolio project\n- Study statistics",
      ),
    ).toEqual([
      "Learn Python basics",
      "Build a portfolio project",
      "Study statistics",
    ]);
  });

  it("splits long single-paragraph summaries into sentences", () => {
    const bullets = parseRoadmapSummaryBullets(
      "Master core concepts. Apply them in projects. Prepare for team delivery.",
    );
    expect(bullets.length).toBeGreaterThan(1);
  });
});
