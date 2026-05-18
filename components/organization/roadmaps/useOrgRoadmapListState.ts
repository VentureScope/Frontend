"use client";

import { useCallback, useState } from "react";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";

function toggleResourceInPaths(
  paths: LearningPath[],
  pathId: string,
  moduleId: string,
  resourceId: string,
): LearningPath[] {
  return paths.map((path) => {
    if (path.id !== pathId) {
      return path;
    }
    return {
      ...path,
      modules: path.modules.map((module) => {
        if (module.id !== moduleId) {
          return module;
        }
        return {
          ...module,
          resources: module.resources.map((resource) => {
            if (resource.id !== resourceId) {
              return resource;
            }
            const newStatus =
              resource.status === "completed" ? "in-progress" : "completed";
            return { ...resource, status: newStatus };
          }),
        };
      }),
    };
  });
}

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
      setPaths((prev) =>
        toggleResourceInPaths(prev, pathId, moduleId, resourceId) as T[],
      );
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
