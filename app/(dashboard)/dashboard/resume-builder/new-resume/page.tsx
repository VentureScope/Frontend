"use client";

import { NewResumeHeader } from "@/components/resume/NewResumeHeader";
import { RoleSelectionList } from "@/components/new-roadmap/RoleSelectionList";
import { NewRoadmapRolesSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { useNewResumePage } from "@/hooks/useNewResumePage";

export default function NewResumePage() {
  const {
    roles,
    selectedRoleId,
    setSelectedRoleId,
    loadingRoles,
    isEmpty,
    isGenerating,
    handleGenerate,
  } = useNewResumePage();

  return (
    <div className="relative min-h-screen bg-background">
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <NewResumeHeader
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <div className="mt-16">
          {loadingRoles ? (
            <NewRoadmapRolesSkeleton />
          ) : isEmpty ? (
            <p className="text-center text-sm text-muted-foreground">
              No current trending roles available.
            </p>
          ) : (
            <RoleSelectionList
              roles={roles}
              selectedId={selectedRoleId}
              onSelect={setSelectedRoleId}
              listLabel="Target roles for resume"
            />
          )}
        </div>
      </div>
    </div>
  );
}
