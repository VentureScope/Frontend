import {
  roadmapListItemToStubPath,
  roadmapOutToLearningPath,
} from "@/lib/map-roadmap-to-learning-path";
import { getRoadmap, listRoadmaps } from "@/lib/roadmaps-api";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";

export async function fetchRoadmapsList() {
  return listRoadmaps();
}

export async function fetchRoadmapDetail(roadmapId: string): Promise<LearningPath> {
  const full = await getRoadmap(roadmapId);
  return roadmapOutToLearningPath(full);
}

export function roadmapsListToStubPaths(
  items: Awaited<ReturnType<typeof fetchRoadmapsList>>,
): LearningPath[] {
  return items.map((item) => roadmapListItemToStubPath(item));
}
