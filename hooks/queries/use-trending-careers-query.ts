"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTrendingCareers } from "@/lib/queries/market";

export function useTrendingCareersQuery(
  days: number,
  limit: number,
  options?: { enabled?: boolean; keepPreviousData?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.market.trending(days, limit),
    queryFn: () => fetchTrendingCareers(days, limit),
    enabled: options?.enabled ?? true,
    placeholderData: options?.keepPreviousData ? keepPreviousData : undefined,
  });
}
