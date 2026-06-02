"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchJobStats } from "@/lib/queries/market";

export function useJobStatsQuery(days: number) {
  return useQuery({
    queryKey: queryKeys.market.jobStats(days),
    queryFn: () => fetchJobStats(days),
  });
}
