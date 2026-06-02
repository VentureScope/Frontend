"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { getUserReadiness } from "@/lib/readiness-api";
import { queryKeys } from "@/lib/query-keys";
import type { UserReadiness } from "@/types/readiness";

export function useUserReadinessQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.readiness.user(),
    queryFn: () => getUserReadiness(),
    enabled: options?.enabled !== false,
  });
}

export function useRefreshUserReadiness() {
  const queryClient = useQueryClient();

  return async (): Promise<UserReadiness> => {
    const data = await getUserReadiness({ refresh: true });
    queryClient.setQueryData(queryKeys.readiness.user(), data);
    return data;
  };
}

export function getReadinessQueryError(error: unknown): string | null {
  if (!error) {
    return null;
  }
  return getApiErrorMessage(error);
}
