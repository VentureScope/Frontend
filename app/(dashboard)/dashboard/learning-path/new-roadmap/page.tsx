"use client";

import { NewRoadmapHeader } from "@/components/new-roadmap/NewRoadmapHeader";
import { EvolutionTabs } from "@/components/new-roadmap/NewRoadmapTabs";
import { FutureRolesForecastChart } from "@/components/new-roadmap/FutureRolesForecastChart";
import { RoleSelectionList } from "@/components/new-roadmap/RoleSelectionList";
import {
  FutureRolesChartSkeleton,
  NewRoadmapRolesSkeleton,
} from "@/components/learning-path/LearningPathSkeletons";
import { useNewRoadmapPage } from "@/hooks/useNewRoadmapPage";

export default function NewRoadmapPage() {
  const {
    activeTab,
    selectedRoleId,
    setSelectedRoleId,
    displayedRoles,
    futureForecastBars,
    forecastMeta,
    loadingCurrent,
    loadingFuture,
    isEmpty,
    isGenerating,
    handleTabChange,
    handleGenerate,
  } = useNewRoadmapPage();

  const listLoading = activeTab === "current" ? loadingCurrent : loadingFuture;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute right-0 top-0 h-[600px] w-auto text-border opacity-50 dark:opacity-25"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M800 50C600 150 400 50 200 250S0 450 -100 550"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M850 150C650 250 450 150 250 350S50 550 -50 650"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/20"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <NewRoadmapHeader
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <div className="mt-16">
          <EvolutionTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="mt-10">
            {listLoading ? (
              activeTab === "future" ? (
                <FutureRolesChartSkeleton />
              ) : (
                <NewRoadmapRolesSkeleton />
              )
            ) : isEmpty ? (
              <p className="text-center text-sm text-muted-foreground">
                {activeTab === "future"
                  ? "Forecast data is not available yet. Try again later."
                  : "No current trending roles available."}
              </p>
            ) : activeTab === "future" ? (
              <FutureRolesForecastChart
                bars={futureForecastBars}
                selectedId={selectedRoleId}
                onSelect={setSelectedRoleId}
                meta={forecastMeta}
              />
            ) : (
              <RoleSelectionList
                roles={displayedRoles}
                selectedId={selectedRoleId}
                onSelect={setSelectedRoleId}
                listLabel="Current trending roles"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
