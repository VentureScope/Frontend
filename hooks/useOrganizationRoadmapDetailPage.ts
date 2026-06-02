"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  fetchOrgRoadmapSummary,
  isOrgRoadmapNotFoundError,
} from "@/lib/organization-roadmap-service";
import {
  isCreatedByUser,
  isEnrolledInRoadmap,
  orgRoadmapDetailId,
  resolveCurrentUserId,
} from "@/lib/organization-roadmap-utils";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useOrganizationRoadmapDetailQuery } from "@/hooks/queries/use-organization-roadmap-detail-query";
import { useOrganizationRoadmapsQuery } from "@/hooks/queries/use-organization-roadmaps-query";
import { useRoadmapResourceToggle } from "@/hooks/useRoadmapResourceToggle";
import { getApiErrorMessage } from "@/lib/auth-api";
import { enrollOrganizationRoadmap } from "@/lib/organizations-api";
import { queryKeys } from "@/lib/query-keys";
import { useAppStore } from "@/store/useAppStore";

export function useOrganizationRoadmapDetailPage(
  orgId: string,
  roadmapId: string,
) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authUser = useAppStore((s) => s.authData.user);
  const userId = resolveCurrentUserId(authUser?.id as string | undefined);
  const userName = authUser?.full_name?.trim() || "You";

  const { members, loading: membersLoading } = useOrganizationMembers(orgId);
  const roadmapsListQuery = useOrganizationRoadmapsQuery(orgId);

  const prerequisitesReady =
    !membersLoading &&
    !roadmapsListQuery.isPending &&
    roadmapsListQuery.data != null;

  const detailQuery = useOrganizationRoadmapDetailQuery(orgId, roadmapId, {
    members,
    roadmapsListRaw: roadmapsListQuery.data,
    enabled: prerequisitesReady,
  });

  const [meta, setMeta] = useState<OrganizationRoadmap | undefined>(undefined);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [forking, setForking] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!detailQuery.data) {
      return;
    }

    const { roadmap, resolvedRoadmapId } = detailQuery.data;

    if (resolvedRoadmapId !== roadmapId) {
      router.replace(
        `/dashboard/organization/${orgId}/roadmaps/${resolvedRoadmapId}`,
      );
      return;
    }

    const withMeta = attachForkMetadata(roadmap);
    setMeta(withMeta);
    setPath(withMeta);
  }, [detailQuery.data, orgId, roadmapId, router]);

  useEffect(() => {
    if (!detailQuery.isError) {
      return;
    }
    if (isOrgRoadmapNotFoundError(detailQuery.error)) {
      clearForkReferences(orgId, roadmapId);
    }
    setMeta(undefined);
    setPath(null);
  }, [detailQuery.error, detailQuery.isError, orgId, roadmapId]);

  const { syncingResourceId, handleToggleResource } =
    useRoadmapResourceToggle(setPath);

  const loading =
    membersLoading ||
    roadmapsListQuery.isPending ||
    (detailQuery.isPending && !path);

  const error = detailQuery.isError
    ? getApiErrorMessage(detailQuery.error)
    : null;

  const createdByMe = meta ? isCreatedByUser(meta, userId) : false;
  const isFork = meta ? isPersonalFork(meta) : false;
  const isEnrolled = meta ? isEnrolledInRoadmap(meta, userId) : false;
  const existingForkId =
    meta && !createdByMe && !isFork
      ? findUserForkOfRoadmap(orgId, roadmapId, userId, [])
      : undefined;

  const backHref = isFork
    ? "/dashboard/organization/roadmaps"
    : `/dashboard/organization/${orgId}/roadmaps`;

  const showEnroll = !isFork && !isEnrolled;
  const showFork = !createdByMe && !isFork;

  const handleEnroll = useCallback(() => {
    if (!meta || !path) {
      return;
    }

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
        setPath(refreshed);
        queryClient.setQueryData(
          queryKeys.organizations.roadmapDetail(orgId, roadmapId),
          {
            roadmap: refreshed,
            resolvedRoadmapId: orgRoadmapDetailId(meta),
          },
        );
        toast.success("You're enrolled — your progress will be tracked.");
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setEnrolling(false);
      }
    })();
  }, [members, meta, orgId, path, queryClient, roadmapId]);

  const handleFork = useCallback(() => {
    if (!meta) {
      return;
    }

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
  }, [existingForkId, members, meta, orgId, router, userId, userName]);

  return {
    path,
    meta,
    loading,
    error,
    forking,
    enrolling,
    backHref,
    showEnroll,
    showFork,
    existingForkId,
    syncingResourceId,
    handleToggleResource,
    handleEnroll,
    handleFork,
    orgId,
  };
}
