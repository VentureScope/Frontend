"use client";

import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import {
  toggleResourceWithSync,
  toggleResourceWithSyncOnPaths,
} from "@/lib/roadmap-progress-sync";

export function useRoadmapResourceToggle(
  setPath: Dispatch<SetStateAction<LearningPath | null>>,
) {
  const [syncingResourceId, setSyncingResourceId] = useState<string | null>(
    null,
  );

  const handleToggleResource = useCallback(
    (moduleId: string, resourceId: string) => {
      toggleResourceWithSync(
        setPath,
        moduleId,
        resourceId,
        setSyncingResourceId,
      );
    },
    [setPath],
  );

  return { syncingResourceId, handleToggleResource };
}

export function useRoadmapResourceToggleOnPaths<T extends LearningPath>(
  setPaths: Dispatch<SetStateAction<T[]>>,
) {
  const [syncingResourceId, setSyncingResourceId] = useState<string | null>(
    null,
  );

  const handleToggleResource = useCallback(
    (pathId: string, moduleId: string, resourceId: string) => {
      toggleResourceWithSyncOnPaths(
        setPaths,
        pathId,
        moduleId,
        resourceId,
        setSyncingResourceId,
      );
    },
    [setPaths],
  );

  return { syncingResourceId, handleToggleResource };
}
