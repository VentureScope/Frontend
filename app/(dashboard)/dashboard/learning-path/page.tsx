"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HeaderSection } from "@/components/learning-path/HeaderSection";
import { TabNavigation } from "@/components/learning-path/TabNavigation";
import { PathCard } from "@/components/learning-path/PathCard";
import { BarChart3, Cloud } from "lucide-react";
import { tabsData } from "./mockData";
import type { LearningPath } from "./mockData";
import { useRouter } from "next/navigation";
import { getFutureTrendingRoles } from "@/lib/jobs-api";
import { listRoadmaps, getRoadmap } from "@/lib/roadmaps-api";
import {
  buildTrendNameSet,
  CURRENT_TRENDS_TAB,
  FUTURE_PREDICTIONS_TAB,
  roadmapBelongsToTab,
} from "@/lib/trending-career-segments";
import {
  roadmapListItemToStubPath,
  roadmapOutToLearningPath,
} from "@/lib/map-roadmap-to-learning-path";
import { syncRoadmapStepProgress } from "@/lib/roadmap-progress-sync";
import { LearningPathListSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { toast } from "sonner";

function toggleResourceInPaths(
  paths: LearningPath[],
  pathId: string,
  moduleId: string,
  resourceId: string,
): LearningPath[] {
  return paths.map((path) => {
    if (path.id !== pathId) {
      return path;
    }
    return {
      ...path,
      modules: path.modules.map((module) => {
        if (module.id !== moduleId) {
          return module;
        }
        return {
          ...module,
          resources: module.resources.map((resource) => {
            if (resource.id !== resourceId) {
              return resource;
            }
            const newStatus =
              resource.status === "completed" ? "in-progress" : "completed";
            return { ...resource, status: newStatus };
          }),
        };
      }),
    };
  });
}

export default function LearningPathPage() {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useState(tabsData[0].id);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [expandedPathIds, setExpandedPathIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const [futureTrendNames, setFutureTrendNames] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [list, futureCareers] = await Promise.all([
          listRoadmaps(),
          getFutureTrendingRoles({ limit: 24 }).catch(() => []),
        ]);
        if (cancelled) {
          return;
        }
        setFutureTrendNames(
          buildTrendNameSet(futureCareers.map((c) => c.name)),
        );
        setPaths(list.map((item) => roadmapListItemToStubPath(item)));
      } catch {
        if (!cancelled) {
          toast.error("Could not load roadmaps.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPaths = useMemo(() => {
    const tabId =
      activeTabId === FUTURE_PREDICTIONS_TAB
        ? FUTURE_PREDICTIONS_TAB
        : CURRENT_TRENDS_TAB;

    return [...paths]
      .filter((path) =>
        roadmapBelongsToTab(path.trendName, tabId, futureTrendNames),
      )
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
  }, [paths, activeTabId, futureTrendNames]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedPathIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });

    setPaths((prev) => {
      const entry = prev.find((p) => p.id === id);
      if (entry && entry.modules.length > 0) {
        return prev;
      }
      setDetailLoadingId(id);
      void (async () => {
        try {
          const full = await getRoadmap(id);
          setPaths((p) =>
            p.map((path) =>
              path.id === id ? roadmapOutToLearningPath(full) : path,
            ),
          );
        } catch {
          toast.error("Could not load roadmap details.");
        } finally {
          setDetailLoadingId((cur) => (cur === id ? null : cur));
        }
      })();
      return prev;
    });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BarChart3":
        return <BarChart3 className="h-5 w-5 text-primary" />;
      case "Cloud":
        return <Cloud className="h-5 w-5 text-primary" />;
      default:
        return <BarChart3 className="h-5 w-5 text-primary" />;
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/learning-path/${id}`);
  };

  const handleToggleResource = (
    pathId: string,
    moduleId: string,
    resourceId: string,
  ) => {
    setPaths((prev) => {
      const next = toggleResourceInPaths(
        prev,
        pathId,
        moduleId,
        resourceId,
      );
      const mod = next
        .find((p) => p.id === pathId)
        ?.modules.find((m) => m.id === moduleId);
      if (mod) {
        void syncRoadmapStepProgress(moduleId, mod.resources).catch(() => {
          toast.error("Could not sync step progress.");
        });
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <HeaderSection />
        <TabNavigation
          tabs={tabsData}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        />

        {loading ? (
          <LearningPathListSkeleton />
        ) : filteredPaths.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {activeTabId === FUTURE_PREDICTIONS_TAB
              ? "No future-prediction roadmaps yet. Generate one from a predicted role."
              : "No current-trend roadmaps yet."}{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() =>
                router.push("/dashboard/learning-path/new-roadmap")
              }
            >
              Generate one
            </button>
            .
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {filteredPaths.map((path) => (
              <PathCard
                key={path.id}
                path={{
                  ...path,
                  icon: getIcon(path.iconName),
                  onToggleResource: (mId: string, rId: string) =>
                    handleToggleResource(path.id, mId, rId),
                }}
                isExpanded={expandedPathIds.includes(path.id)}
                onToggleExpand={handleToggleExpand}
                onViewDetails={handleViewDetails}
                isDetailLoading={detailLoadingId === path.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
