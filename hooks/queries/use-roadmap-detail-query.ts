"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchRoadmapDetail } from "@/lib/queries/roadmaps";

export function useRoadmapDetailQuery(
  roadmapId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.roadmaps.detail(roadmapId),
    queryFn: () => fetchRoadmapDetail(roadmapId),
    enabled: options?.enabled ?? Boolean(roadmapId),
  });
}
