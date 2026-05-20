import api from "@/lib/api";
import type {
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
