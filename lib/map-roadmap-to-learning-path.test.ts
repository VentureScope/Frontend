import { describe, expect, it } from "vitest";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import {
  applyResourceToggleToLearningPath,
  roadmapOutToLearningPath,
  toggleResourceInLearningPath,
} from "@/lib/map-roadmap-to-learning-path";
import type { ResourceToggleOut, RoadmapOut } from "@/types/roadmap";
import { resourceUiStatusFromApi } from "@/types/roadmap";

function sampleRoadmap(): RoadmapOut {
  return {
    id: "roadmap-1",
    title: "Test Roadmap",
    total_weeks: 1,
    status: "in_progress",
    created_at: "2026-01-01T00:00:00Z",
    steps_completed: 0,
    total_steps: 1,
    completion_percentage: 0,
    steps: [
      {
        id: "step-1",
        week_number: 1,
        topic: "Intro",
        status: "active",
        progress: { status: "not_started" },
        resources: [
          {
            id: "res-a",
            title: "Resource A",
            completed: false,
          },
          {
            id: "res-b",
            title: "Resource B",
            completed: true,
          },
        ],
      },
    ],
  };
}

function toggleOut(
  overrides: Partial<ResourceToggleOut> & Pick<ResourceToggleOut, "resource_id" | "completed">,
): ResourceToggleOut {
  return {
    step_id: "step-1",
    step_status: "in_progress",
    resources_completed: 1,
    total_resources: 2,
    resource_completion_pct: 50,
    roadmap_status: "in_progress",
    steps_completed: 0,
    total_steps: 1,
    completion_percentage: 0,
    ...overrides,
  };
}

function pathWithModule(path: LearningPath): LearningPath {
  return {
    ...path,
    modules: [
      {
        id: "step-1",
        title: "Week 1: Intro",
        description: "",
        status: "in-progress",
        resources: [
          {
            id: "res-a",
            type: "DOCUMENTATION",
            title: "Resource A",
            meta: "Resource",
            status: "in-progress",
          },
          {
            id: "res-b",
            type: "DOCUMENTATION",
            title: "Resource B",
            meta: "Resource",
            status: "completed",
          },
        ],
      },
    ],
  };
}

describe("resourceUiStatusFromApi", () => {
  const step = sampleRoadmap().steps![0];

  it("maps per-resource completed flags on a not_started step", () => {
    expect(resourceUiStatusFromApi(step.resources![0], step)).toBe("in-progress");
    expect(resourceUiStatusFromApi(step.resources![1], step)).toBe("completed");
  });

  it("marks all resources completed when the step is completed", () => {
    const completedStep = {
      ...step,
      progress: { status: "completed" },
      resources: step.resources!.map((r) => ({ ...r, completed: false })),
    };
    expect(resourceUiStatusFromApi(completedStep.resources![0], completedStep)).toBe(
      "completed",
    );
  });
});

describe("roadmapOutToLearningPath", () => {
  it("loads mixed resource completion instead of copying step status", () => {
    const path = roadmapOutToLearningPath(sampleRoadmap());
    const resources = path.modules[0].resources;

    expect(resources[0].status).toBe("in-progress");
    expect(resources[1].status).toBe("completed");
  });

  it("keeps synthetic overview resources locked", () => {
    const roadmap = sampleRoadmap();
    roadmap.steps![0].resources = [];
    const path = roadmapOutToLearningPath(roadmap);

    expect(path.modules[0].resources).toHaveLength(1);
    expect(path.modules[0].resources[0].id).toBe("step-1-overview");
    expect(path.modules[0].resources[0].status).toBe("locked");
  });
});

describe("toggleResourceInLearningPath", () => {
  it("checks an incomplete resource", () => {
    const base = pathWithModule(roadmapOutToLearningPath(sampleRoadmap()));
    const next = toggleResourceInLearningPath(base, "step-1", "res-a");

    expect(next.modules[0].resources[0].status).toBe("completed");
    expect(next.modules[0].resources[1].status).toBe("completed");
  });

  it("unchecks a completed resource", () => {
    const base = pathWithModule(roadmapOutToLearningPath(sampleRoadmap()));
    const next = toggleResourceInLearningPath(base, "step-1", "res-b");

    expect(next.modules[0].resources[1].status).toBe("in-progress");
    expect(next.modules[0].resources[0].status).toBe("in-progress");
  });

  it("promotes a locked module when the first resource is checked", () => {
    const base = pathWithModule(roadmapOutToLearningPath(sampleRoadmap()));
    base.modules[0].status = "locked";

    const next = toggleResourceInLearningPath(base, "step-1", "res-a");

    expect(next.modules[0].status).toBe("in-progress");
  });
});

describe("applyResourceToggleToLearningPath", () => {
  it("marks every resource complete when the step completes", () => {
    const base = pathWithModule(roadmapOutToLearningPath(sampleRoadmap()));
    const next = applyResourceToggleToLearningPath(
      base,
      "step-1",
      "res-a",
      toggleOut({
        resource_id: "res-a",
        completed: true,
        step_status: "completed",
        resources_completed: 2,
        completion_percentage: 100,
      }),
    );

    expect(next.modules[0].status).toBe("completed");
    expect(next.modules[0].resources.map((r) => r.status)).toEqual([
      "completed",
      "completed",
    ]);
    expect(next.progress).toBe(100);
  });

  it("unchecks only the toggled resource when the step stays in progress", () => {
    const base = pathWithModule(roadmapOutToLearningPath(sampleRoadmap()));
    const next = applyResourceToggleToLearningPath(
      base,
      "step-1",
      "res-b",
      toggleOut({
        resource_id: "res-b",
        completed: false,
        step_status: "in_progress",
        resources_completed: 0,
      }),
    );

    expect(next.modules[0].status).toBe("in-progress");
    expect(next.modules[0].resources[0].status).toBe("in-progress");
    expect(next.modules[0].resources[1].status).toBe("in-progress");
  });

  it("resets all resources when the step returns to not_started", () => {
    const base = pathWithModule(roadmapOutToLearningPath(sampleRoadmap()));
    base.modules[0].resources[1].status = "completed";

    const next = applyResourceToggleToLearningPath(
      base,
      "step-1",
      "res-b",
      toggleOut({
        resource_id: "res-b",
        completed: false,
        step_status: "not_started",
        resources_completed: 0,
      }),
    );

    expect(next.modules[0].status).toBe("locked");
    expect(next.modules[0].resources.map((r) => r.status)).toEqual([
      "in-progress",
      "in-progress",
    ]);
  });
});
