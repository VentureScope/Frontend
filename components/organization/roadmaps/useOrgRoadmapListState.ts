"use client";

import { useCallback, useState } from "react";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { useRoadmapResourceToggleOnPaths } from "@/hooks/useRoadmapResourceToggle";

export function useOrgRoadmapListState<T extends LearningPath>(
  initial: T[],
) {
  const [paths, setPaths] = useState<T[]>(initial);
  const [expandedPathIds, setExpandedPathIds] = useState<string[]>([]);
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);

  const { syncingResourceId, handleToggleResource } =
    useRoadmapResourceToggleOnPaths(setPaths);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedPathIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  return {
    paths,
    setPaths,
    expandedPathIds,
    detailLoadingId,
    setDetailLoadingId,
    syncingResourceId,
    handleToggleExpand,
    handleToggleResource,
  };
}
