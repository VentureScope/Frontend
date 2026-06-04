"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchInDemandSkills } from "@/lib/queries/market";

export function useInDemandSkillsQuery(
  days: number,
  limit: number,
  options?: { enabled?: boolean; keepPreviousData?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.market.inDemandSkills(days, limit),
    queryFn: () => fetchInDemandSkills(days, limit),
    enabled: options?.enabled ?? true,
    placeholderData: options?.keepPreviousData ? keepPreviousData : undefined,
  });
}
