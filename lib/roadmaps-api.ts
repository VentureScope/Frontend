import api from "@/lib/api";
import type {
  ResourceToggleRequest,
  ResourceToggleOut,
  RoadmapGenerateRequest,
  RoadmapListItem,
  RoadmapOut,
  StepProgressUpdate,
  StepProgressUpdateOut,
} from "@/types/roadmap";

export async function listRoadmaps(): Promise<RoadmapListItem[]> {
  const res = await api.get<RoadmapListItem[]>("/api/roadmaps");
  return res.data;
}

/** Full roadmap: steps, resources, and per-resource progress. */
export async function getRoadmap(roadmapId: string): Promise<RoadmapOut> {
  const res = await api.get<RoadmapOut>(`/api/roadmaps/${roadmapId}`);
  return res.data;
}

export async function generateRoadmap(
  body: RoadmapGenerateRequest,
): Promise<RoadmapOut> {
  const res = await api.post<RoadmapOut>("/api/roadmaps/generate", body);
  return res.data;
}

/** @deprecated Use `toggleRoadmapResource` */
export async function updateStepProgress(
  stepId: string,
  body: StepProgressUpdate,
): Promise<StepProgressUpdateOut> {
  const res = await api.patch<StepProgressUpdateOut>(
    `/api/roadmaps/steps/${stepId}/progress`,
    body,
  );
  return res.data;
}

export async function toggleRoadmapResource(
  resourceId: string,
  body: ResourceToggleRequest,
): Promise<ResourceToggleOut> {
  const res = await api.post<ResourceToggleOut>(
    `/api/roadmaps/resources/${resourceId}/toggle`,
    body,
  );
  return res.data;
}
