"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { tabsData } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { useRoadmapsListQuery } from "@/hooks/queries/use-roadmaps-list-query";
import { useRoadmapResourceToggleOnPaths } from "@/hooks/useRoadmapResourceToggle";
import {
  CURRENT_TRENDS_TAB,
  FUTURE_PREDICTIONS_TAB,
  roadmapBelongsToTab,
} from "@/lib/trending-career-segments";
import {
  fetchRoadmapDetail,
  roadmapsListToStubPaths,
} from "@/lib/queries/roadmaps";
import { queryKeys } from "@/lib/query-keys";

function mergeListWithCachedDetails(
  list: LearningPath[],
  prev: LearningPath[],
  queryClient: ReturnType<typeof useQueryClient>,
): LearningPath[] {
  const prevById = new Map(prev.map((path) => [path.id, path]));

  return list.map((stub) => {
    const existing = prevById.get(stub.id);
    if (existing?.modules.length) {
      return existing;
    }

    const cached = queryClient.getQueryData<LearningPath>(
      queryKeys.roadmaps.detail(stub.id),
    );
    if (cached) {
      return cached;
    }

    return stub;
  });
}

export function useLearningPathPage() {
  const queryClient = useQueryClient();
  const listQuery = useRoadmapsListQuery();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [activeTabId, setActiveTabId] = useState(tabsData[0].id);
  const [expandedPathIds, setExpandedPathIds] = useState<string[]>([]);
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const { syncingResourceId, handleToggleResource } =
    useRoadmapResourceToggleOnPaths(setPaths);

  useEffect(() => {
    if (!listQuery.data) {
      return;
    }

    const stubs = roadmapsListToStubPaths(listQuery.data);
    setPaths((prev) => mergeListWithCachedDetails(stubs, prev, queryClient));
  }, [listQuery.data, queryClient]);

  useEffect(() => {
    for (const path of paths) {
      if (path.modules.length > 0) {
        queryClient.setQueryData(queryKeys.roadmaps.detail(path.id), path);
      }
    }
  }, [paths, queryClient]);

  useEffect(() => {
    if (listQuery.isError) {
      toast.error("Could not load roadmaps.");
    }
  }, [listQuery.isError]);

  const filteredPaths = useMemo(() => {
    const tabId =
      activeTabId === FUTURE_PREDICTIONS_TAB
        ? FUTURE_PREDICTIONS_TAB
        : CURRENT_TRENDS_TAB;

    return [...paths]
      .filter((path) => roadmapBelongsToTab(path.trendMode, tabId))
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
  }, [paths, activeTabId]);

  const tabsWithCounts = useMemo(() => {
    return tabsData.map((tab) => {
      const tabId =
        tab.id === FUTURE_PREDICTIONS_TAB
          ? FUTURE_PREDICTIONS_TAB
          : CURRENT_TRENDS_TAB;
      const count = paths.filter((path) =>
        roadmapBelongsToTab(path.trendMode, tabId),
      ).length;
      return { ...tab, name: `${tab.name} (${count})` };
    });
  }, [paths]);

  const handleToggleExpand = useCallback(
    (id: string) => {
      setExpandedPathIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((x) => x !== id);
        }
        return [...prev, id];
      });

      const cached = queryClient.getQueryData<LearningPath>(
        queryKeys.roadmaps.detail(id),
      );
      if (cached?.modules.length) {
        setPaths((prev) =>
          prev.map((path) => (path.id === id ? cached : path)),
        );
        return;
      }

      let needsFetch = true;
      setPaths((prev) => {
        const entry = prev.find((p) => p.id === id);
        if (entry?.modules.length) {
          needsFetch = false;
        }
        return prev;
      });
      if (!needsFetch) {
        return;
      }

      setDetailLoadingId(id);
      void queryClient
        .fetchQuery({
          queryKey: queryKeys.roadmaps.detail(id),
          queryFn: () => fetchRoadmapDetail(id),
        })
        .then((full) => {
          setPaths((prev) =>
            prev.map((path) => (path.id === id ? full : path)),
          );
        })
        .catch(() => {
          toast.error("Could not load roadmap details.");
          setExpandedPathIds((prev) => prev.filter((x) => x !== id));
        })
        .finally(() => {
          setDetailLoadingId((cur) => (cur === id ? null : cur));
        });
    },
    [queryClient],
  );

  const listLoading = listQuery.isPending && paths.length === 0;

  return {
    activeTabId,
    setActiveTabId,
    filteredPaths,
    tabsWithCounts,
    expandedPathIds,
    detailLoadingId,
    syncingResourceId,
    handleToggleExpand,
    handleToggleResource,
    listLoading,
    isEmpty:
      !listLoading &&
      listQuery.isSuccess &&
      filteredPaths.length === 0,
  };
}
