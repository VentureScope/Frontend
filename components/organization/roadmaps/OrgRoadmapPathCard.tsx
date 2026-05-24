"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  GitFork,
  User,
} from "lucide-react";
import ResourceItem from "@/components/learning-path/ResourceItem";
import { PathCardModulesSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { RoadmapModulesLoadingHint } from "@/components/roadmap-view/RoadmapUxTips";
import { ParticipantAvatars } from "@/components/organization/roadmaps/ParticipantAvatars";
import { Button } from "@/components/ui/button";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import { cn } from "@/lib/utils";

type Props = {
  roadmap: OrganizationRoadmap & {
    icon: ReactNode;
    myProgress: number;
    isCreatedByMe: boolean;
    isEnrolled: boolean;
    onToggleResource?: (moduleId: string, resourceId: string) => void;
  };
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onViewDetails: (id: string) => void;
  isDetailLoading?: boolean;
  syncingResourceId?: string | null;
  showTeamEnrollment?: boolean;
  canFork?: boolean;
  onFork?: (id: string) => void;
  userForkId?: string | null;
};

function moduleStepClass(status: string): string {
  if (status === "completed") {
    return "bg-primary text-primary-foreground";
  }
  if (status === "in-progress") {
    return "border-2 border-primary bg-primary/10 text-primary";
  }
  return "border-2 border-border bg-card text-sm font-semibold text-muted-foreground";
}

function ProgressBlock({
  progress,
  isEnrolled,
  isExpanded,
  hasModules,
  className,
}: {
  progress: number;
  isEnrolled: boolean;
  isExpanded: boolean;
  hasModules: boolean;
  className?: string;
}) {
  return (
    <div className={cn("w-full min-w-[168px] sm:w-52", className)}>
      {!isExpanded && !hasModules ? (
        <p className="text-label mb-2 text-muted-foreground">
          Expand to load weeks & resources
        </p>
      ) : null}
      <div className="text-label mb-2 flex justify-between gap-3">
        <span className="text-muted-foreground">Your progress</span>
        <span className="shrink-0 font-semibold text-primary">
          {progress}% complete
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-lg bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {!isEnrolled && progress === 0 ? (
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Not enrolled — open to preview
        </p>
      ) : null}
    </div>
  );
}

export function OrgRoadmapPathCard({
  roadmap,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  isDetailLoading,
  syncingResourceId = null,
  showTeamEnrollment = true,
  canFork = false,
  onFork,
  userForkId = null,
}: Props) {
  const enrolledFromApi = roadmap.totalMembers ?? 0;
  const hasProgressRows = roadmap.participants.some((p) => p.progress > 0);
  const showAvatars =
    showTeamEnrollment && hasProgressRows && roadmap.participants.length > 0;
  const enrollmentLabel =
    showTeamEnrollment && enrolledFromApi > 0
      ? `${enrolledFromApi} ${enrolledFromApi === 1 ? "member" : "members"} enrolled`
      : showAvatars
        ? `${roadmap.participants.length} on this roadmap`
        : null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all">
      <div
        className="cursor-pointer p-6 sm:p-8"
        onClick={() => onToggleExpand(roadmap.id)}
      >
        <div className="flex items-start justify-between gap-4 sm:items-center sm:gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              {roadmap.icon}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className="text-lg font-semibold text-foreground transition-colors hover:text-primary sm:text-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(roadmap.id);
                  }}
                >
                  {roadmap.title}
                </h3>
                {roadmap.isCreatedByMe ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Created by you
                  </span>
                ) : null}
                {roadmap.isEnrolled ? (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    Enrolled
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-muted-foreground sm:text-body">
                Focus: {roadmap.focus}
                {roadmap.totalWeeks != null
                  ? ` · ${roadmap.totalWeeks} week${roadmap.totalWeeks === 1 ? "" : "s"}`
                  : ""}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {roadmap.forkedFrom ? (
                  <span>
                    Forked from{" "}
                    <span className="font-medium text-foreground">
                      {roadmap.forkedFrom.title}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    Created by {roadmap.createdByName}
                  </span>
                )}
                {enrollmentLabel ? (
                  <>
                    <span aria-hidden className="hidden text-border sm:inline">
                      ·
                    </span>
                    <span>{enrollmentLabel}</span>
                  </>
                ) : null}
              </div>

              {showAvatars ? (
                <ParticipantAvatars
                  participants={roadmap.participants}
                  className="pt-0.5"
                />
              ) : null}
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-4 md:flex lg:gap-6">
            <ProgressBlock
              progress={roadmap.myProgress}
              isEnrolled={roadmap.isEnrolled}
              isExpanded={isExpanded}
              hasModules={roadmap.modules.length > 0}
            />
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 md:mt-0 md:hidden">
          <ProgressBlock
            progress={roadmap.myProgress}
            isEnrolled={roadmap.isEnrolled}
            isExpanded={isExpanded}
            hasModules={roadmap.modules.length > 0}
            className="flex-1"
          />
          {isExpanded ? (
            <ChevronUp className="h-6 w-6 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground" />
          )}
        </div>

        <div
          className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={() => onViewDetails(roadmap.id)}
          >
            Open roadmap
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          {canFork && onFork ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 text-xs"
              onClick={() => onFork(roadmap.id)}
            >
              <GitFork className="h-3.5 w-3.5" />
              {userForkId ? "View your fork" : "Fork for myself"}
            </Button>
          ) : null}
        </div>
      </div>

      {isExpanded ? (
        <div className="border-t border-border bg-muted/40 p-6 sm:p-10">
          {isDetailLoading && roadmap.modules.length === 0 ? (
            <>
              <RoadmapModulesLoadingHint />
              <PathCardModulesSkeleton />
            </>
          ) : roadmap.modules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Could not load weeks and resources. Try again or open the full
              roadmap.
            </p>
          ) : (
            <div className="relative space-y-12">
              <div className="absolute bottom-0 left-[15px] top-4 w-px bg-primary/20" />
              {roadmap.modules.map((module, index) => (
                <div key={module.id} className="relative pl-12">
                  <div
                    className={cn(
                      "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-background",
                      moduleStepClass(module.status),
                    )}
                  >
                    {module.status === "completed" ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-foreground">
                    {module.title}
                  </h4>
                  {module.description ? (
                    <p className="mb-6 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  ) : (
                    <div className="mb-6" />
                  )}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {module.resources.map((resource) => (
                      <ResourceItem
                        key={resource.id}
                        id={resource.id}
                        type={resource.type}
                        title={resource.title}
                        meta={resource.meta}
                        status={resource.status}
                        thumbnail={resource.thumbnail}
                        url={resource.url}
                        isSaving={syncingResourceId === resource.id}
                        onToggle={() =>
                          roadmap.onToggleResource?.(module.id, resource.id)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
