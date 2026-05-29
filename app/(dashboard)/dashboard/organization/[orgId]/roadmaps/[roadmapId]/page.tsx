"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, GitFork, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { RoadmapDetailView } from "@/components/roadmap-view/RoadmapDetailView";
import { RoadmapDetailPageSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { RoadmapUxTips } from "@/components/roadmap-view/RoadmapUxTips";
import { Button } from "@/components/ui/button";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import type { OrganizationRoadmap } from "@/types/organization-roadmap";
import {
  attachForkMetadata,
  clearForkReferences,
  findUserForkOfRoadmap,
  forkOrganizationRoadmap,
  isPersonalFork,
} from "@/lib/organization-roadmap-fork";
import {
  fetchOrgRoadmapLessonPage,
  fetchOrgRoadmapSummary,
  isOrgRoadmapNotFoundError,
} from "@/lib/organization-roadmap-service";
import {
  isCreatedByUser,
  isEnrolledInRoadmap,
  orgRoadmapDetailId,
  resolveCurrentUserId,
} from "@/lib/organization-roadmap-utils";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useOrganizationRoadmapsQuery } from "@/hooks/queries/use-organization-roadmaps-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { useRoadmapResourceToggle } from "@/hooks/useRoadmapResourceToggle";
import { enrollOrganizationRoadmap } from "@/lib/organizations-api";
import {
  formatRoadmapStatus,
  roadmapStatusBadgeClass,
} from "@/lib/roadmap-utils";
import { useAppStore } from "@/store/useAppStore";

export default function OrganizationRoadmapDetailPage({
  params,
}: {
  params: Promise<{ orgId: string; roadmapId: string }>;
}) {
  const { orgId, roadmapId } = use(params);
  const router = useRouter();
  const { organization } = useOrganization(orgId);
  const { members, loading: membersLoading } = useOrganizationMembers(orgId);
  const roadmapsListQuery = useOrganizationRoadmapsQuery(orgId);
  const authUser = useAppStore((s) => s.authData.user);
  const userId = resolveCurrentUserId(authUser?.id as string | undefined);
  const userName = authUser?.full_name?.trim() || "You";

  const orgName = organization?.displayName ?? "Organization";

  const [meta, setMeta] = useState<OrganizationRoadmap | undefined>(undefined);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forking, setForking] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (roadmapsListQuery.isPending || membersLoading) {
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const { roadmap, resolvedRoadmapId } = await fetchOrgRoadmapLessonPage(
          orgId,
          roadmapId,
          members,
          {
            roadmapsListRaw: roadmapsListQuery.data,
          },
        );

        if (cancelled) return;

        if (resolvedRoadmapId !== roadmapId) {
          router.replace(
            `/dashboard/organization/${orgId}/roadmaps/${resolvedRoadmapId}`,
          );
          return;
        }

        const withMeta = attachForkMetadata(roadmap);
        setMeta(withMeta);
        setPath(withMeta);
      } catch (err) {
        if (cancelled) return;
        if (isOrgRoadmapNotFoundError(err)) {
          clearForkReferences(orgId, roadmapId);
        }
        setError(getApiErrorMessage(err));
        setMeta(undefined);
        setPath(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    orgId,
    roadmapId,
    members,
    membersLoading,
    router,
    roadmapsListQuery.data,
    roadmapsListQuery.isPending,
  ]);

  const { syncingResourceId, handleToggleResource } =
    useRoadmapResourceToggle(setPath);

  if (loading) {
    return (
      <div className="min-h-screen">
        <RoadmapDetailPageSkeleton />
      </div>
    );
  }

  if (error || !path || !meta) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-h1 text-foreground">Roadmap not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          {error ??
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

  const createdByMe = isCreatedByUser(meta, userId);
  const isFork = isPersonalFork(meta);
  const isEnrolled = isEnrolledInRoadmap(meta, userId);
  const existingForkId =
    !createdByMe && !isFork
      ? findUserForkOfRoadmap(orgId, roadmapId, userId, [])
      : undefined;

  const handleEnroll = () => {
    void (async () => {
      setEnrolling(true);
      try {
        await enrollOrganizationRoadmap(orgId, orgRoadmapDetailId(meta));
        const summary = await fetchOrgRoadmapSummary(
          orgId,
          orgRoadmapDetailId(meta),
          members,
        );
        const refreshed = attachForkMetadata({ ...summary, modules: path.modules });
        setMeta(refreshed);
        toast.success("You're enrolled — your progress will be tracked.");
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setEnrolling(false);
      }
    })();
  };

  const handleFork = () => {
    void (async () => {
      if (existingForkId) {
        router.push(
          `/dashboard/organization/${orgId}/roadmaps/${existingForkId}`,
        );
        return;
      }
      setForking(true);
      try {
        const forked = await forkOrganizationRoadmap(
          orgId,
          meta,
          userId,
          userName,
          members,
        );
        toast.success("Fork created — it's in My roadmaps under Created by me.");
        router.push(
          `/dashboard/organization/${orgId}/roadmaps/${orgRoadmapDetailId(forked)}`,
        );
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setForking(false);
      }
    })();
  };

  const backHref = isFork
    ? "/dashboard/organization/roadmaps"
    : `/dashboard/organization/${orgId}/roadmaps`;

  const showEnroll = !isFork && !isEnrolled;
  const showFork = !createdByMe && !isFork;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href={backHref}
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
                    <span className="text-foreground/80">
                      Personal copy
                    </span>
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
            {showEnroll ? (
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                disabled={enrolling}
                onClick={handleEnroll}
              >
                <UserPlus className="h-3.5 w-3.5" />
                {enrolling ? "Enrolling…" : "Enroll"}
              </Button>
            ) : null}
            {showFork ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={forking}
                onClick={handleFork}
              >
                <GitFork className="h-3.5 w-3.5" />
                {existingForkId
                  ? "View your fork"
                  : forking
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
            onToggleResource: handleToggleResource,
          }}
          syncingResourceId={syncingResourceId}
        />
      </main>
    </div>
  );
}
