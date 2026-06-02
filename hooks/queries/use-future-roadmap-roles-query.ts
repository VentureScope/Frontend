"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchFutureRoadmapRoles } from "@/lib/queries/market";

/** Forecast-ranked roles for new-roadmap future tab (lazy-loaded). */
export function useFutureRoadmapRolesQuery(
  limit: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.market.futureRoadmapRoles(limit),
    queryFn: () => fetchFutureRoadmapRoles(limit),
    enabled: options?.enabled ?? true,
  });
}
