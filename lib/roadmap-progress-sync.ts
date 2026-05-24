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

const pendingResourceToggles = new Set<string>();

export function isResourceTogglePending(resourceId: string): boolean {
  return pendingResourceToggles.has(resourceId);
}

export async function syncResourceToggle(
  resourceId: string,
  completed: boolean,
): Promise<ResourceToggleOut> {
  return toggleRoadmapResource(resourceId, { completed });
}

type SyncingChangeHandler = (resourceId: string | null) => void;

function beginResourceToggle(
  resourceId: string,
  onSyncingChange?: SyncingChangeHandler,
): boolean {
  if (pendingResourceToggles.has(resourceId)) {
    return false;
  }
  pendingResourceToggles.add(resourceId);
  onSyncingChange?.(resourceId);
  return true;
}

function endResourceToggle(
  resourceId: string,
  onSyncingChange?: SyncingChangeHandler,
): void {
  pendingResourceToggles.delete(resourceId);
  onSyncingChange?.(null);
}

/** Optimistic toggle + persist via resource toggle API; reverts on failure. */
export function toggleResourceWithSync(
  setPath: Dispatch<SetStateAction<LearningPath | null>>,
  moduleId: string,
  resourceId: string,
  onSyncingChange?: SyncingChangeHandler,
): void {
  if (!beginResourceToggle(resourceId, onSyncingChange)) {
    return;
  }

  setPath((prev) => {
    if (!prev) {
      endResourceToggle(resourceId, onSyncingChange);
      return prev;
    }

    const mod = prev.modules.find((m) => m.id === moduleId);
    const resource = mod?.resources.find((r) => r.id === resourceId);
    if (!resource || resource.status === "locked") {
      endResourceToggle(resourceId, onSyncingChange);
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
      })
      .finally(() => {
        endResourceToggle(resourceId, onSyncingChange);
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
  onSyncingChange?: SyncingChangeHandler,
): void {
  if (!beginResourceToggle(resourceId, onSyncingChange)) {
    return;
  }

  setPaths((prev) => {
    const path = prev.find((p) => p.id === pathId);
    if (!path) {
      endResourceToggle(resourceId, onSyncingChange);
      return prev;
    }

    const mod = path.modules.find((m) => m.id === moduleId);
    const resource = mod?.resources.find((r) => r.id === resourceId);
    if (!resource || resource.status === "locked") {
      endResourceToggle(resourceId, onSyncingChange);
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
      })
      .finally(() => {
        endResourceToggle(resourceId, onSyncingChange);
      });

    return optimistic;
  });
}
