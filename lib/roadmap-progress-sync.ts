import type { Dispatch, SetStateAction } from "react";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { toggleRoadmapResource } from "@/lib/roadmaps-api";
import {
  applyResourceToggleToLearningPath,
  toggleResourceInLearningPath,
} from "@/lib/map-roadmap-to-learning-path";
import type { ResourceToggleOut } from "@/types/roadmap";
import { toast } from "sonner";

export { toggleResourceInLearningPath, applyResourceToggleToLearningPath };

export async function syncResourceToggle(
  resourceId: string,
  completed: boolean,
): Promise<ResourceToggleOut> {
  return toggleRoadmapResource(resourceId, { completed });
}

/** Optimistic toggle + persist via resource toggle API; reverts on failure. */
export function toggleResourceWithSync(
  setPath: Dispatch<SetStateAction<LearningPath | null>>,
  moduleId: string,
  resourceId: string,
): void {
  setPath((prev) => {
    if (!prev) {
      return prev;
    }

    const mod = prev.modules.find((m) => m.id === moduleId);
    const resource = mod?.resources.find((r) => r.id === resourceId);
    if (!resource || resource.status === "locked") {
      return prev;
    }

    const completed = resource.status !== "completed";
    const snapshot = prev;
    const optimistic = toggleResourceInLearningPath(prev, moduleId, resourceId);

    void syncResourceToggle(resourceId, completed)
      .then((out) => {
        setPath((current) =>
          current
            ? applyResourceToggleToLearningPath(current, moduleId, resourceId, out)
            : current,
        );
      })
      .catch(() => {
        toast.error("Could not save progress.");
        setPath(snapshot);
      });

    return optimistic;
  });
}

/** Same as `toggleResourceWithSync` for list views keyed by path id. */
export function toggleResourceWithSyncOnPaths<T extends LearningPath>(
  setPaths: Dispatch<SetStateAction<T[]>>,
  pathId: string,
  moduleId: string,
  resourceId: string,
): void {
  setPaths((prev) => {
    const path = prev.find((p) => p.id === pathId);
    if (!path) {
      return prev;
    }

    const mod = path.modules.find((m) => m.id === moduleId);
    const resource = mod?.resources.find((r) => r.id === resourceId);
    if (!resource || resource.status === "locked") {
      return prev;
    }

    const completed = resource.status !== "completed";
    const snapshot = prev;
    const optimistic = prev.map((p) =>
      p.id === pathId
        ? toggleResourceInLearningPath(p, moduleId, resourceId)
        : p,
    ) as T[];

    void syncResourceToggle(resourceId, completed)
      .then((out) => {
        setPaths((current) =>
          current.map((p) =>
            p.id === pathId
              ? (applyResourceToggleToLearningPath(
                  p,
                  moduleId,
                  resourceId,
                  out,
                ) as T)
              : p,
          ),
        );
      })
      .catch(() => {
        toast.error("Could not save progress.");
        setPaths(snapshot);
      });

    return optimistic;
  });
}
