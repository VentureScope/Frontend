"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTrendingCareers } from "@/lib/queries/market";

export function useTrendingCareersQuery(days: number, limit: number) {
  return useQuery({
    queryKey: queryKeys.market.trending(days, limit),
    queryFn: () => fetchTrendingCareers(days, limit),
  });
}
