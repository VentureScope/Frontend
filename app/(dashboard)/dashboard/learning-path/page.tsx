"use client";

import { HeaderSection } from "@/components/learning-path/HeaderSection";
import { TabNavigation } from "@/components/learning-path/TabNavigation";
import { PathCard } from "@/components/learning-path/PathCard";
import { BarChart3, Cloud } from "lucide-react";
import { FUTURE_PREDICTIONS_TAB } from "@/lib/trending-career-segments";
import { useRouter } from "next/navigation";
import { LearningPathListSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { RoadmapUxTips } from "@/components/roadmap-view/RoadmapUxTips";
import { useLearningPathPage } from "@/hooks/useLearningPathPage";

function getIcon(iconName: string) {
  switch (iconName) {
    case "Cloud":
      return <Cloud className="h-5 w-5 text-primary" />;
    case "BarChart3":
    default:
      return <BarChart3 className="h-5 w-5 text-primary" />;
  }
}

export default function LearningPathPage() {
  const router = useRouter();
  const {
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
    isEmpty,
  } = useLearningPathPage();

  return (
    <div className="mx-auto max-w-6xl">
      <HeaderSection />
      <TabNavigation
        tabs={tabsWithCounts}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
      />

      <RoadmapUxTips variant="personal-list" className="mt-8" compact />

      {listLoading ? (
        <LearningPathListSkeleton />
      ) : isEmpty ? (
        <p className="mt-10 text-center text-body text-muted-foreground">
          {activeTabId === FUTURE_PREDICTIONS_TAB
            ? "No future-prediction roadmaps yet. Generate one from a predicted role."
            : "No current-trend roadmaps yet."}{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => router.push("/dashboard/learning-path/new-roadmap")}
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
              onViewDetails={(id) => router.push(`/dashboard/learning-path/${id}`)}
              isDetailLoading={detailLoadingId === path.id}
              syncingResourceId={syncingResourceId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
