import type { LearningPath, Module, Resource } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import type { ResourceOut, RoadmapListItem, RoadmapOut, StepOut } from "@/types/roadmap";
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
  if (r.source) {
    bits.push(r.source);
  }
  if (r.resource_type) {
    bits.push(r.resource_type);
  }
  if (r.url && /^https?:\/\//i.test(r.url.trim())) {
    bits.push(r.url.trim());
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

export function roadmapOutToLearningPath(
  roadmap: RoadmapOut,
  iconName = "BarChart3",
): LearningPath {
  const modules = (roadmap.steps ?? []).map(mapStepToModule);
  return {
    id: roadmap.id,
    title: roadmap.title,
    focus: roadmap.trend_name || "Personalized roadmap",
    progress: roadmapProgress(roadmap),
    iconName,
    isExpanded: modules.length > 0,
    modules,
    roadmapStatus: roadmap.status,
    createdAt: roadmap.created_at,
    trendName: roadmap.trend_name ?? null,
  };
}

export function roadmapListItemToStubPath(
  item: RoadmapListItem,
  iconName = "BarChart3",
): LearningPath {
  const trend = item.trend_name?.trim() || "Learning roadmap";
  const focus = `${trend} · ${item.total_weeks} weeks`;

  return {
    id: item.id,
    title: item.title,
    focus,
    progress: 0,
    iconName,
    isExpanded: false,
    modules: [],
    roadmapStatus: item.status,
    createdAt: item.created_at,
    trendName: item.trend_name ?? null,
  };
}
