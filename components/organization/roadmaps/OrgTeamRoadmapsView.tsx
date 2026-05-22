"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Cloud,
  Filter,
  MapPinned,
  Plus,
  Users,
} from "lucide-react";
import { OrgRoadmapPathCard } from "@/components/organization/roadmaps/OrgRoadmapPathCard";
import { RoadmapInfoCallout } from "@/components/organization/roadmaps/RoadmapInfoCallout";
import { useOrgRoadmapListState } from "@/components/organization/roadmaps/useOrgRoadmapListState";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import { OrganizationRoadmapsGridSkeleton } from "@/components/organization/OrganizationSkeletons";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationRoadmaps } from "@/hooks/useOrganizationRoadmaps";
import { forkOrganizationRoadmap } from "@/lib/organization-roadmap-fork";
import { isPersonalFork } from "@/lib/organization-roadmap-fork";
import { loadOrganizationRoadmapsForOrg } from "@/lib/organization-roadmaps-storage";
import {
  filterOrgTeamRoadmaps,
  getMyProgress,
  isCreatedByUser,
  isEnrolledInRoadmap,
  resolveCurrentUserId,
} from "@/lib/organization-roadmap-utils";
import { toast } from "sonner";
import type {
  OrganizationRoadmap,
  OrgTeamRoadmapsFilter,
} from "@/types/organization-roadmap";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/auth-api";

const FILTER_OPTIONS: { id: OrgTeamRoadmapsFilter; label: string }[] = [
  { id: "all", label: "All team roadmaps" },
  { id: "created-by-me", label: "Created by me" },
];

function getIcon(iconName: string) {
  switch (iconName) {
    case "Cloud":
      return <Cloud className="h-5 w-5 text-primary" />;
    default:
      return <BarChart3 className="h-5 w-5 text-primary" />;
  }
}

export function OrgTeamRoadmapsView({ orgId }: { orgId: string }) {
  const router = useRouter();
  const { organization, loading: orgLoading } = useOrganization(orgId);
  const {
    roadmaps,
    loading,
    error,
    canCreate,
    reload,
    loadRoadmapDetail,
    loadingDetailId,
  } = useOrganizationRoadmaps(orgId);

  const authUser = useAppStore((s) => s.authData.user);
  const userId = resolveCurrentUserId(authUser?.id as string | undefined);
  const userName = authUser?.full_name?.trim() || "You";

  const orgName = organization?.displayName ?? "Organization";
  const [filter, setFilter] = useState<OrgTeamRoadmapsFilter>("all");
  const [forkIndexVersion, setForkIndexVersion] = useState(0);

  const { paths, setPaths, expandedPathIds, handleToggleExpand, handleToggleResource } =
    useOrgRoadmapListState<OrganizationRoadmap>([]);

  const apiRoadmaps = useMemo(
    () => roadmaps.filter((r) => !isPersonalFork(r)),
    [roadmaps],
  );

  useEffect(() => {
    setPaths(apiRoadmaps);
  }, [apiRoadmaps, setPaths]);

  const createHref = `/dashboard/organization/${orgId}/roadmaps/new`;

  const userForkBySource = useMemo(() => {
    void forkIndexVersion;
    const map = new Map<string, string>();
    for (const r of loadOrganizationRoadmapsForOrg(orgId)) {
      if (r.createdByUserId === userId && r.forkedFrom) {
        map.set(r.forkedFrom.roadmapId, r.id);
      }
    }
    return map;
  }, [orgId, userId, forkIndexVersion]);

  const handleExpand = useCallback(
    async (roadmapId: string) => {
      const isExpanded = expandedPathIds.includes(roadmapId);
      handleToggleExpand(roadmapId);

      if (isExpanded) return;

      const target = paths.find((r) => r.id === roadmapId);
      if (target && target.modules.length > 0) return;

      try {
        const detail = await loadRoadmapDetail(roadmapId);
        setPaths((prev) =>
          prev.map((r) => (r.id === roadmapId ? detail : r)),
        );
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      }
    },
    [
      expandedPathIds,
      handleToggleExpand,
      paths,
      loadRoadmapDetail,
      setPaths,
    ],
  );

  const handleFork = useCallback(
    (sourceId: string) => {
      const existingId = userForkBySource.get(sourceId);
      if (existingId) {
        router.push(`/dashboard/organization/${orgId}/roadmaps/${existingId}`);
        return;
      }

      const source = paths.find((r) => r.id === sourceId);
      if (!source || isPersonalFork(source)) {
        return;
      }

      const forked = forkOrganizationRoadmap(source, userId, userName);
      setForkIndexVersion((v) => v + 1);
      toast.success("Fork created — it's in My roadmaps under Created by me.");
      router.push(`/dashboard/organization/${orgId}/roadmaps/${forked.id}`);
    },
    [orgId, router, userForkBySource, userId, userName, paths],
  );

  const filtered = useMemo(
    () => filterOrgTeamRoadmaps(paths, userId, filter),
    [paths, userId, filter],
  );

  const enrolledCount = paths.filter((r) =>
    isEnrolledInRoadmap(r, userId),
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href={`/dashboard/organization/${orgId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {orgLoading ? "…" : orgName}
      </Link>

      <OrganizationPageHeader
        label={orgName}
        title="Team roadmaps"
        description={`Learning roadmaps assigned to ${orgName}. Expand a card to load steps, track team completion, or open the full detail view.`}
        icon={MapPinned}
      />

      {error ? (
        <div className="mb-6 flex gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void reload()}>
            Retry
          </Button>
        </div>
      ) : null}

      <RoadmapInfoCallout icon={Users} title="Shared by your organization">
        Roadmaps are generated for the whole team. Your personal progress is tracked
        per member when you open a roadmap. Fork a path to keep a private copy in My
        roadmaps.
      </RoadmapInfoCallout>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === opt.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {canCreate ? (
          <Button asChild size="sm" className="gap-1.5 shrink-0">
            <Link href={createHref}>
              <Plus className="h-4 w-4" />
              Create roadmap
            </Link>
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Only the organization owner can assign new roadmaps.
          </p>
        )}
      </div>

      <p className="text-label mb-6 text-muted-foreground">
        {loading
          ? "Loading roadmaps…"
          : `${filtered.length} roadmap${filtered.length === 1 ? "" : "s"}`}
        {!loading && filter === "all" && enrolledCount > 0
          ? ` · You are on ${enrolledCount}`
          : ""}
      </p>

      {loading ? (
        <OrganizationRoadmapsGridSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <div className="vs-surface rounded-md border border-dashed border-border px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">
            {filter === "created-by-me"
              ? "No roadmaps match this filter"
              : "No team roadmaps yet"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {filter === "created-by-me"
              ? "The API does not expose roadmap creators yet. Switch to All team roadmaps."
              : "Assign the first learning path for your organization."}
          </p>
          {canCreate && filter !== "created-by-me" ? (
            <Button asChild className="mt-6 gap-2" size="sm">
              <Link href={createHref}>
                <Plus className="h-4 w-4" />
                Create roadmap
              </Link>
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((roadmap) => {
            const createdByMe = isCreatedByUser(roadmap, userId);
            const detailLoading = loadingDetailId === roadmap.id;
            return (
              <OrgRoadmapPathCard
                key={roadmap.id}
                roadmap={{
                  ...roadmap,
                  icon: getIcon(roadmap.iconName),
                  myProgress: getMyProgress(roadmap, userId),
                  isCreatedByMe: createdByMe,
                  isEnrolled: isEnrolledInRoadmap(roadmap, userId),
                  onToggleResource: (mId, rId) =>
                    handleToggleResource(roadmap.id, mId, rId),
                }}
                isExpanded={expandedPathIds.includes(roadmap.id)}
                onToggleExpand={handleExpand}
                onViewDetails={(id) =>
                  router.push(`/dashboard/organization/${orgId}/roadmaps/${id}`)
                }
                isDetailLoading={detailLoading}
                showTeamEnrollment
                canFork={!createdByMe}
                onFork={handleFork}
                userForkId={userForkBySource.get(roadmap.id) ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
