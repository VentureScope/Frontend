"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTopHiringCompanies } from "@/lib/queries/market";

type UseTopHiringCompaniesQueryOptions = {
  enabled?: boolean;
};

export function useTopHiringCompaniesQuery(
  days: number,
  categories: string[],
  options?: UseTopHiringCompaniesQueryOptions,
) {
  const categoriesKey = categories.join("|");
  const enabled = (options?.enabled ?? true) && categories.length > 0;

  return useQuery({
    queryKey: queryKeys.market.hiringCompanies(days, categoriesKey),
    queryFn: () => fetchTopHiringCompanies(categories),
    enabled,
  });
}
