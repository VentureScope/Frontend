"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { RoadmapDetailView } from "@/components/roadmap-view/RoadmapDetailView";
import { RoadmapDetailPageSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { ParticipantAvatars } from "@/components/organization/roadmaps/ParticipantAvatars";
import { RoadmapInfoCallout } from "@/components/organization/roadmaps/RoadmapInfoCallout";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";
import { MOCK_ORGANIZATION_ROADMAPS } from "@/lib/organization-roadmaps-data";
import {
  getMyProgress,
  getRoadmapById,
  isCreatedByUser,
  resolveCurrentUserId,
} from "@/lib/organization-roadmap-utils";
import { useAppStore } from "@/store/useAppStore";

function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toggleResourceInPath(
  path: LearningPath,
  moduleId: string,
  resourceId: string,
): LearningPath {
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
}

export default function OrganizationRoadmapDetailPage({
  params,
}: {
  params: Promise<{ orgId: string; roadmapId: string }>;
}) {
  const { orgId, roadmapId } = use(params);
  const authUser = useAppStore((s) => s.authData.user);
  const userId = resolveCurrentUserId(authUser?.id as string | undefined);

  const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);
  const orgName = org?.name ?? nameFromSlug(orgId);

  const source = useMemo(
    () => getRoadmapById(MOCK_ORGANIZATION_ROADMAPS, roadmapId),
    [roadmapId],
  );

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!source) {
      setLoading(false);
      return;
    }
    const myProgress = getMyProgress(source, userId);
    setPath({
      ...source,
      progress: myProgress,
    });
    setLoading(false);
  }, [source, userId]);

  const handleToggleResource = useCallback(
    (moduleId: string, resourceId: string) => {
      setPath((prev) => {
        if (!prev) {
          return prev;
        }
        return toggleResourceInPath(prev, moduleId, resourceId);
      });
    },
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <RoadmapDetailPageSkeleton />
      </div>
    );
  }

  if (!path || !source) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-h1 text-foreground">Roadmap not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          This roadmap may have been removed or you may not have access.
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

  const createdByMe = isCreatedByUser(source, userId);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href={`/dashboard/organization/${orgId}/roadmaps`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {orgName} roadmaps
          </Link>
          {createdByMe && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Created by you
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <RoadmapInfoCallout icon={Users} title="Organization roadmap">
          You are viewing a shared roadmap inside <strong>{orgName}</strong>.
          Progress below reflects your enrollment only.{" "}
          {source.participants.length} member
          {source.participants.length === 1 ? "" : "s"} are on this path.
        </RoadmapInfoCallout>

        <div className="flex flex-wrap items-center gap-4 px-1">
          <ParticipantAvatars participants={source.participants} max={6} />
          <p className="text-xs text-muted-foreground">
            Teammates taking this roadmap
          </p>
        </div>

        <RoadmapDetailView
          path={{
            ...path,
            onToggleResource: handleToggleResource,
          }}
        />
      </div>
    </div>
  );
}
