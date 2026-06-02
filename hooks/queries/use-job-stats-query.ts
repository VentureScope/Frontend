"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchJobStats } from "@/lib/queries/market";

/** Dashboard + market-trends — pass lookback days from market period selector. */
export function useJobStatsQuery(
  period: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.market.jobStats(period),
    queryFn: () => fetchJobStats(period),
    enabled: options?.enabled ?? true,
  });
}
