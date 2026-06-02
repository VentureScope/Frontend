"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchRoadmapsList } from "@/lib/queries/roadmaps";

/** User roadmaps list (shared with dashboard overview). */
export function useRoadmapsListQuery() {
  return useQuery({
    queryKey: queryKeys.roadmaps.list(),
    queryFn: fetchRoadmapsList,
  });
}
