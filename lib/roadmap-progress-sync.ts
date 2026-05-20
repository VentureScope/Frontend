import type { Resource } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { updateStepProgress } from "@/lib/roadmaps-api";
import type { StepProgressUpdateOut } from "@/types/roadmap";

function aggregateStepStatus(resources: Resource[]): string {
  const allDone = resources.every((r) => r.status === "completed");
  if (allDone) {
    return "completed";
  }
  const anyActive = resources.some(
    (r) => r.status === "completed" || r.status === "in-progress",
  );
  if (anyActive) {
    return "in_progress";
  }
  return "not_started";
}

export async function syncRoadmapStepProgress(
  stepId: string,
  resources: Resource[],
): Promise<StepProgressUpdateOut> {
  const status = aggregateStepStatus(resources);
  return updateStepProgress(stepId, { status });
}
