"use client";

import Link from "next/link";
import { ArrowLeft, GitFork, UserPlus } from "lucide-react";
import { RoadmapDetailView } from "@/components/roadmap-view/RoadmapDetailView";
import { RoadmapDetailPageSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { RoadmapUxTips } from "@/components/roadmap-view/RoadmapUxTips";
import { Button } from "@/components/ui/button";
import { useOrganizationRoadmapDetailPage } from "@/hooks/useOrganizationRoadmapDetailPage";
import {
  formatRoadmapStatus,
  roadmapStatusBadgeClass,
} from "@/lib/roadmap-utils";

type OrganizationRoadmapDetailViewProps = {
  orgId: string;
  roadmapId: string;
};

export function OrganizationRoadmapDetailView({
  orgId,
  roadmapId,
}: OrganizationRoadmapDetailViewProps) {
  const page = useOrganizationRoadmapDetailPage(orgId, roadmapId);

  if (page.loading) {
    return (
      <div className="min-h-screen">
        <RoadmapDetailPageSkeleton />
      </div>
    );
  }

  if (page.error || !page.path || !page.meta) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-h1 text-foreground">Roadmap not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          {page.error ??
            "This roadmap may have been removed, or the link uses an outdated id."}
        </p>
        <Link
          href={`/dashboard/organization/${orgId}/roadmaps`}
          className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Back to team roadmaps
        </Link>
      </div>
    );
  }

  const { path, meta } = page;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href={page.backHref}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-foreground">
                {path.title}
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground">
                {path.totalWeeks != null
                  ? `${path.totalWeeks} week${path.totalWeeks === 1 ? "" : "s"}`
                  : "Learning roadmap"}
                {path.trendName ? ` · ${path.trendName}` : ""}
                {meta.forkedFrom ? (
                  <>
                    {" · "}
                    <span className="text-foreground/80">Personal copy</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {path.roadmapStatus ? (
              <span className={roadmapStatusBadgeClass(path.roadmapStatus)}>
                {formatRoadmapStatus(path.roadmapStatus)}
              </span>
            ) : null}
            {page.showEnroll ? (
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                disabled={page.enrolling}
                onClick={page.handleEnroll}
              >
                <UserPlus className="h-3.5 w-3.5" />
                {page.enrolling ? "Enrolling…" : "Enroll"}
              </Button>
            ) : null}
            {page.showFork ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={page.forking}
                onClick={page.handleFork}
              >
                <GitFork className="h-3.5 w-3.5" />
                {page.existingForkId
                  ? "View your fork"
                  : page.forking
                    ? "Forking…"
                    : "Fork for myself"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <RoadmapUxTips variant="personal-detail" className="mb-8" compact />
        <RoadmapDetailView
          path={{
            ...path,
            onToggleResource: page.handleToggleResource,
          }}
          syncingResourceId={page.syncingResourceId}
        />
      </main>
    </div>
  );
}
