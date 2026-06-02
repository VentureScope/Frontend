"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchJobForecastsForRole } from "@/lib/queries/market";

export function useRoleForecastsQuery(role: string) {
  return useQuery({
    queryKey: queryKeys.market.roleForecasts(role),
    queryFn: () => fetchJobForecastsForRole(role),
    enabled: Boolean(role),
  });
}
