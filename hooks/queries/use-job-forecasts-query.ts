"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchJobForecasts } from "@/lib/queries/market";

/** Bulk demand forecasts for all roles (lazy-loaded on future tab). */
export function useJobForecastsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.market.forecasts(),
    queryFn: fetchJobForecasts,
    enabled: options?.enabled ?? true,
  });
}
