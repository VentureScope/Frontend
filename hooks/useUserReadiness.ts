"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { getUserReadiness } from "@/lib/readiness-api";
import type { UserReadiness } from "@/types/readiness";

export function useUserReadiness(options?: { autoLoad?: boolean }) {
  const autoLoad = options?.autoLoad !== false;
  const [readiness, setReadiness] = useState<UserReadiness | null>(null);
  const [loading, setLoading] = useState(autoLoad);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getUserReadiness({ refresh });
      setReadiness(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    void load(false);
  }, [autoLoad, load]);

  return {
    readiness,
    loading,
    refreshing,
    error,
    reload: () => load(false),
    refresh: () => load(true),
  };
}
