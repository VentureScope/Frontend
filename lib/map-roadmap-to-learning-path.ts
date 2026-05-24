import type { LearningPath, Module, Resource } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import {
  formatRoadmapListFocus,
  iconNameForTrend,
  resolveRoadmapDisplayStatus,
} from "@/lib/roadmap-utils";
import type {
  ResourceOut,
  ResourceToggleOut,
  RoadmapListItem,
  RoadmapOut,
  StepOut,
} from "@/types/roadmap";
import { stepProgressDone, stepUiStatus } from "@/types/roadmap";

function resourceTypeFromApi(
  r: { resource_type?: string | null },
): Resource["type"] {
  const t = (r.resource_type || "").toLowerCase();
  if (t === "video") {
    return "VIDEO";
  }
  if (t === "course" || t.includes("course")) {
    return "COURSE MODULE";
  }
  if (t === "article") {
    return "ARTICLE";
  }
  if (t === "project") {
    return "PROJECT";
  }
  if (t === "book") {
    return "BOOK";
  }
  if (t === "documentation") {
    return "DOCUMENTATION";
  }
  return "DOCUMENTATION";
}

function resourceMeta(r: ResourceOut): string {
  const bits: string[] = [];
  if (r.resource_type) {
    bits.push(
      r.resource_type.charAt(0).toUpperCase() + r.resource_type.slice(1),
    );
  }
  if (r.source) {
    bits.push(r.source.replace(/_/g, " "));
  }
  return bits.join(" · ") || "Resource";
}

function mapStepToModule(step: StepOut): Module {
  const stepStatus = stepUiStatus(step);
  const resources: Resource[] = (step.resources ?? []).map((r) => ({
    id: r.id,
    type: resourceTypeFromApi(r),
    title: r.title,
    meta: resourceMeta(r),
    status: stepStatus,
    url: r.url || null,
  }));

  if (resources.length === 0) {
    resources.push({
      id: `${step.id}-overview`,
      type: "DOCUMENTATION",
      title: step.topic,
      meta: "Roadmap step",
      status: stepStatus,
    });
  }

  return {
    id: step.id,
    title: `Week ${step.week_number}: ${step.topic}`,
    description: step.description || "",
    status: stepStatus,
    resources,
  };
}

function roadmapProgress(roadmap: RoadmapOut): number {
  const steps = roadmap.steps ?? [];
  if (steps.length === 0) {
    return 0;
  }
  const done = steps.filter((s) => stepProgressDone(s)).length;
  return Math.round((done / steps.length) * 100);
}

function resolveCompletionPercent(
  fromApi: number | undefined,
  fallback: number,
): number {
  if (typeof fromApi === "number" && !Number.isNaN(fromApi)) {
    return Math.round(Math.min(100, Math.max(0, fromApi)));
  }
  return fallback;
}

function derivedRoadmapStatus(
  roadmap: Pick<
    RoadmapOut,
    | "status"
    | "completion_percentage"
    | "steps_completed"
    | "total_steps"
    | "steps"
  >,
  modulesCount: number,
): string {
  return resolveRoadmapDisplayStatus({
    status: roadmap.status,
    completion_percentage: roadmap.completion_percentage,
    steps_completed: roadmap.steps_completed,
    total_steps: roadmap.total_steps ?? modulesCount,
    steps: roadmap.steps,
  });
}

export function roadmapOutToLearningPath(
  roadmap: RoadmapOut,
  iconName?: string,
): LearningPath {
  const modules = (roadmap.steps ?? []).map(mapStepToModule);
  const computed = roadmapProgress(roadmap);
  const icon = iconName ?? iconNameForTrend(roadmap.trend_name);
  const displayStatus = derivedRoadmapStatus(roadmap, modules.length);

  return {
    id: roadmap.id,
    title: roadmap.title,
    focus: formatRoadmapListFocus({
      id: roadmap.id,
      title: roadmap.title,
      trend_name: roadmap.trend_name,
      total_weeks: roadmap.total_weeks,
      status: displayStatus,
      created_at: roadmap.created_at,
      steps_completed: roadmap.steps_completed,
      total_steps: roadmap.total_steps ?? modules.length,
      completion_percentage: roadmap.completion_percentage,
    }),
    progress: resolveCompletionPercent(
      roadmap.completion_percentage,
      computed,
    ),
    iconName: icon,
    isExpanded: modules.length > 0,
    modules,
    roadmapStatus: displayStatus,
    createdAt: roadmap.created_at,
    trendName: roadmap.trend_name ?? null,
    goal: roadmap.goal ?? null,
    summary: roadmap.summary ?? null,
    totalWeeks: roadmap.total_weeks,
    stepsCompleted: roadmap.steps_completed,
    totalSteps: roadmap.total_steps ?? modules.length,
  };
}

export function roadmapListItemToStubPath(item: RoadmapListItem): LearningPath {
  const displayStatus = resolveRoadmapDisplayStatus({
    status: item.status,
    completion_percentage: item.completion_percentage,
    steps_completed: item.steps_completed,
    total_steps: item.total_steps,
  });

  return {
    id: item.id,
    title: item.title,
    focus: formatRoadmapListFocus({ ...item, status: displayStatus }),
    progress: resolveCompletionPercent(item.completion_percentage, 0),
    iconName: iconNameForTrend(item.trend_name),
    isExpanded: false,
    modules: [],
    roadmapStatus: displayStatus,
    createdAt: item.created_at,
    trendName: item.trend_name ?? null,
    totalWeeks: item.total_weeks,
    stepsCompleted: item.steps_completed,
    totalSteps: item.total_steps,
  };
}

function apiStatusToResourceStatus(
  status: string,
): Resource["status"] {
  const normalized = status.toLowerCase().replace(/-/g, "_");
  if (normalized === "completed") {
    return "completed";
  }
  if (normalized === "in_progress") {
    return "in-progress";
  }
  return "locked";
}

export function toggleResourceInLearningPath(
  path: LearningPath,
  moduleId: string,
  resourceId: string,
): LearningPath {
  return {
    ...path,
    modules: path.modules.map((module) => {
      if (module.id !== moduleId) {
        return module;
      }
      return {
        ...module,
        resources: module.resources.map((resource) => {
          if (resource.id !== resourceId) {
            return resource;
          }
          const newStatus =
            resource.status === "completed" ? "in-progress" : "completed";
          return { ...resource, status: newStatus };
        }),
      };
    }),
  };
}

/** Apply POST /resources/{id}/toggle response — backend is source of truth for progress. */
export function applyResourceToggleToLearningPath(
  path: LearningPath,
  moduleId: string,
  resourceId: string,
  out: ResourceToggleOut,
): LearningPath {
  const moduleStatus = apiStatusToResourceStatus(out.step_status);
  const resourceStatus = out.completed ? "completed" : "in-progress";

  const displayStatus = resolveRoadmapDisplayStatus({
    status: out.roadmap_status,
    completion_percentage: out.completion_percentage,
    steps_completed: out.steps_completed,
    total_steps: out.total_steps,
    steps: path.modules.map((m) => ({
      id: m.id,
      week_number: 0,
      topic: m.title,
      status: m.id === moduleId ? moduleStatus : m.status,
      progress: {
        status:
          m.id === moduleId
            ? out.step_status
            : m.status === "completed"
              ? "completed"
              : m.status === "in-progress"
                ? "in_progress"
                : "not_started",
      },
    })),
  });

  return {
    ...path,
    progress: resolveCompletionPercent(
      out.completion_percentage,
      path.progress,
    ),
    roadmapStatus: displayStatus,
    stepsCompleted: out.steps_completed,
    totalSteps: out.total_steps,
    focus: formatRoadmapListFocus({
      id: path.id,
      title: path.title,
      trend_name: path.trendName,
      total_weeks: path.totalWeeks ?? 0,
      status: displayStatus,
      created_at: path.createdAt ?? new Date().toISOString(),
      steps_completed: out.steps_completed,
      total_steps: out.total_steps,
      completion_percentage: out.completion_percentage,
    }),
    modules: path.modules.map((module) => {
      if (module.id !== moduleId) {
        return module;
      }
      return {
        ...module,
        status: moduleStatus,
        resources: module.resources.map((resource) => {
          if (resource.id !== resourceId) {
            return resource;
          }
          return { ...resource, status: resourceStatus };
        }),
      };
    }),
  };
}

/** Apply roadmap-level stats returned after a step progress PATCH */
export function applyRoadmapProgressStats(
  path: LearningPath,
  stats: {
    completion_percentage: number;
    roadmap_status: string;
    steps_completed: number;
    total_steps: number;
  },
): LearningPath {
  const displayStatus = resolveRoadmapDisplayStatus({
    status: stats.roadmap_status,
    completion_percentage: stats.completion_percentage,
    steps_completed: stats.steps_completed,
    total_steps: stats.total_steps,
    steps: path.modules.map((m) => ({
      id: m.id,
      week_number: 0,
      topic: m.title,
      status: m.status,
      progress: {
        status:
          m.status === "completed"
            ? "completed"
            : m.status === "in-progress"
              ? "in_progress"
              : "not_started",
      },
    })),
  });

  return {
    ...path,
    progress: resolveCompletionPercent(stats.completion_percentage, path.progress),
    roadmapStatus: displayStatus,
    stepsCompleted: stats.steps_completed,
    totalSteps: stats.total_steps,
    focus: formatRoadmapListFocus({
      id: path.id,
      title: path.title,
      trend_name: path.trendName,
      total_weeks: path.totalWeeks ?? 0,
      status: displayStatus,
      created_at: path.createdAt ?? new Date().toISOString(),
      steps_completed: stats.steps_completed,
      total_steps: stats.total_steps,
      completion_percentage: stats.completion_percentage,
    }),
  };
}
