"use client";

import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  User,
} from "lucide-react";
import ResourceItem from "@/components/learning-path/ResourceItem";
import { PathCardModulesSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { ParticipantAvatars } from "@/components/organization/roadmaps/ParticipantAvatars";
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
  showTeamEnrollment?: boolean;
};

export function OrgRoadmapPathCard({
  roadmap,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  isDetailLoading,
  showTeamEnrollment = true,
}: Props) {
  const learnerCount = roadmap.participants.length;

  return (
    <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all">
      <div
        className="cursor-pointer p-6 sm:p-8"
        onClick={() => onToggleExpand(roadmap.id)}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              {roadmap.icon}
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className="text-xl font-semibold text-foreground transition-colors hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(roadmap.id);
                  }}
                >
                  {roadmap.title}
                </h3>
                {roadmap.isCreatedByMe && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Created by you
                  </span>
                )}
              </div>
              <p className="text-body text-muted-foreground">
                Focus: {roadmap.focus}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5 shrink-0" />
                Created by {roadmap.createdByName}
              </p>
              {showTeamEnrollment && learnerCount > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <ParticipantAvatars participants={roadmap.participants} />
                  <span className="text-xs text-muted-foreground">
                    {learnerCount}{" "}
                    {learnerCount === 1 ? "member" : "members"} on this roadmap
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6 lg:gap-10">
            <div className="w-full min-w-[200px] sm:w-56">
              <div className="text-label mb-2 flex justify-between">
                <span className="text-muted-foreground">Your progress</span>
                <span className="font-semibold text-primary">
                  {roadmap.myProgress}% complete
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-lg bg-primary transition-all duration-500"
                  style={{ width: `${roadmap.myProgress}%` }}
                />
              </div>
              {!roadmap.isEnrolled && roadmap.myProgress === 0 && (
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Not enrolled — open to preview
                </p>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border bg-muted/40 p-6 sm:p-10">
          {isDetailLoading && roadmap.modules.length === 0 ? (
            <PathCardModulesSkeleton />
          ) : roadmap.modules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Module details will load when you open the full roadmap.
            </p>
          ) : (
            <div className="relative space-y-12">
              <div className="absolute bottom-0 left-[15px] top-4 w-px bg-primary/20" />
              {roadmap.modules.map((module, index) => (
                <div key={module.id} className="relative pl-12">
                  <div
                    className={cn(
                      "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-background",
                      module.status === "completed"
                        ? "bg-primary text-primary-foreground"
                        : "border-2 border-primary bg-card text-sm font-semibold text-primary",
                    )}
                  >
                    {module.status === "completed" ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <h4 className="mb-6 text-lg font-semibold text-foreground">
                    {module.title}
                  </h4>
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
      )}
    </div>
  );
}
