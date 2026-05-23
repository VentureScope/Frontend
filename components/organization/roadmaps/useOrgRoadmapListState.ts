"use client";

import { useCallback, useState } from "react";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { toggleResourceWithSyncOnPaths } from "@/lib/roadmap-progress-sync";

export function useOrgRoadmapListState<T extends LearningPath>(
  initial: T[],
) {
  const [paths, setPaths] = useState<T[]>(initial);
  const [expandedPathIds, setExpandedPathIds] = useState<string[]>([]);
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedPathIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleToggleResource = useCallback(
    (pathId: string, moduleId: string, resourceId: string) => {
      toggleResourceWithSyncOnPaths(setPaths, pathId, moduleId, resourceId);
    },
    [],
  );

  return {
    paths,
    setPaths,
    expandedPathIds,
    detailLoadingId,
    setDetailLoadingId,
    handleToggleExpand,
    handleToggleResource,
  };
}
