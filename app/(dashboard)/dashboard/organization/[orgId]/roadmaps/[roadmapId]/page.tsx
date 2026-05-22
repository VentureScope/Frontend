"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, GitFork, Users } from "lucide-react";
import { toast } from "sonner";
import { RoadmapDetailView } from "@/components/roadmap-view/RoadmapDetailView";
import { RoadmapDetailPageSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { ParticipantAvatars } from "@/components/organization/roadmaps/ParticipantAvatars";
import { RoadmapInfoCallout } from "@/components/organization/roadmaps/RoadmapInfoCallout";
import { Button } from "@/components/ui/button";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import {
  findUserForkOfRoadmap,
  forkOrganizationRoadmap,
  isPersonalFork,
} from "@/lib/organization-roadmap-fork";
import { fetchOrganizationRoadmapDetail } from "@/lib/organization-roadmap-service";
import { loadOrganizationRoadmapsForOrg } from "@/lib/organization-roadmaps-storage";
import {
  getMyProgress,
  isCreatedByUser,
  resolveCurrentUserId,
} from "@/lib/organization-roadmap-utils";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { getApiErrorMessage } from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";

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
  const router = useRouter();
  const { organization } = useOrganization(orgId);
  const { members } = useOrganizationMembers(orgId);
  const authUser = useAppStore((s) => s.authData.user);
  const userId = resolveCurrentUserId(authUser?.id as string | undefined);
  const userName = authUser?.full_name?.trim() || "You";

  const orgName = organization?.displayName ?? "Organization";

  const [source, setSource] = useState<OrganizationRoadmap | undefined>(
    undefined,
  );
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);

      const localFork = loadOrganizationRoadmapsForOrg(orgId).find(
        (r) => r.id === roadmapId && isPersonalFork(r),
      );
      if (localFork) {
        if (!cancelled) {
          setSource(localFork);
          setPath({
            ...localFork,
            progress: getMyProgress(localFork, userId),
          });
          setLoading(false);
        }
        return;
      }

      try {
        const roadmap = await fetchOrganizationRoadmapDetail(
          orgId,
          roadmapId,
          members,
        );
        if (!cancelled) {
          setSource(roadmap);
          setPath({
            ...roadmap,
            progress: getMyProgress(roadmap, userId),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setSource(undefined);
          setPath(null);
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
  }, [orgId, roadmapId, members, userId]);

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

  if (error || !path || !source) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-h1 text-foreground">Roadmap not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          {error ?? "This roadmap may have been removed or you may not have access."}
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
  const isFork = isPersonalFork(source);
  const existingFork = !createdByMe && !isFork
    ? findUserForkOfRoadmap(orgId, roadmapId, userId)
    : undefined;

  const handleFork = () => {
    if (existingFork) {
      router.push(
        `/dashboard/organization/${orgId}/roadmaps/${existingFork.id}`,
      );
      return;
    }
    const forked = forkOrganizationRoadmap(source, userId, userName);
    toast.success("Fork created — it's in My roadmaps under Created by me.");
    router.push(`/dashboard/organization/${orgId}/roadmaps/${forked.id}`);
  };

  const backHref = isFork
    ? "/dashboard/organization/roadmaps"
    : `/dashboard/organization/${orgId}/roadmaps`;
  const backLabel = isFork ? "My roadmaps" : `${orgName} roadmaps`;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
          <div className="flex items-center gap-2">
            {!createdByMe && !isFork ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleFork}
              >
                <GitFork className="h-3.5 w-3.5" />
                {existingFork ? "View your fork" : "Fork for myself"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {source.forkedFrom ? (
          <RoadmapInfoCallout icon={GitFork} title="Your personal copy">
            Forked from{" "}
            <strong className="font-medium text-foreground">
              {source.forkedFrom.title}
            </strong>{" "}
            by {source.forkedFrom.createdByName}. Progress is yours alone.{" "}
            <Link
              href={`/dashboard/organization/${orgId}/roadmaps/${source.forkedFrom.roadmapId}`}
              className="font-semibold text-primary hover:underline"
            >
              View original
            </Link>
          </RoadmapInfoCallout>
        ) : (
          <RoadmapInfoCallout icon={Users} title="Organization roadmap">
            Shared roadmap inside <strong>{orgName}</strong>. Progress reflects
            your enrollment. {source.participants.length} member
            {source.participants.length === 1 ? "" : "s"} on this path.
          </RoadmapInfoCallout>
        )}

        {!isFork && source.participants.length > 0 ? (
          <div className="flex flex-wrap items-center gap-4 px-1">
            <ParticipantAvatars participants={source.participants} max={6} />
            <p className="text-xs text-muted-foreground">
              Teammates on this roadmap
            </p>
          </div>
        ) : null}

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
