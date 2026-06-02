"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchInDemandSkills } from "@/lib/queries/market";

export function useInDemandSkillsQuery(days: number, limit: number) {
  return useQuery({
    queryKey: queryKeys.market.inDemandSkills(days, limit),
    queryFn: () => fetchInDemandSkills(days, limit),
  });
}
