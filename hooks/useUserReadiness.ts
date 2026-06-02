"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getReadinessQueryError,
  useUserReadinessQuery,
} from "@/hooks/queries/use-readiness-query";
import { getUserReadiness } from "@/lib/readiness-api";
import { queryKeys } from "@/lib/query-keys";

export function useUserReadiness(options?: { autoLoad?: boolean }) {
  const enabled = options?.autoLoad !== false;
  const queryClient = useQueryClient();
  const query = useUserReadinessQuery({ enabled });
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getUserReadiness({ refresh: true });
      queryClient.setQueryData(queryKeys.readiness.user(), data);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  const reload = useCallback(async () => {
    await query.refetch();
  }, [query]);

  if (!enabled) {
    return {
      readiness: null,
      loading: false,
      refreshing: false,
      error: null,
      reload,
      refresh,
    };
  }

  return {
    readiness: query.data ?? null,
    loading: query.isPending,
    refreshing,
    error: getReadinessQueryError(query.error),
    reload,
    refresh,
  };
}
