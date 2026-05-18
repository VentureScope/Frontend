"use client";

import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { MOCK_ORGANIZATION_ROADMAPS } from "@/lib/organization-roadmaps-data";
import {
  filterOrgTeamRoadmaps,
  getMyProgress,
  isCreatedByUser,
  isEnrolledInRoadmap,
  resolveCurrentUserId,
} from "@/lib/organization-roadmap-utils";
import type { OrgTeamRoadmapsFilter } from "@/types/organization-roadmap";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

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

export function OrgTeamRoadmapsView({
  orgId,
  orgName,
}: {
  orgId: string;
  orgName: string;
}) {
  const router = useRouter();
  const authUser = useAppStore((s) => s.authData.user);
  const userId = resolveCurrentUserId(authUser?.id as string | undefined);

  const orgRoadmaps = useMemo(
    () => MOCK_ORGANIZATION_ROADMAPS.filter((r) => r.orgId === orgId),
    [orgId],
  );

  const [filter, setFilter] = useState<OrgTeamRoadmapsFilter>("all");
  const { paths, expandedPathIds, handleToggleExpand, handleToggleResource } =
    useOrgRoadmapListState(orgRoadmaps);

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
        Back to {orgName}
      </Link>

      <OrganizationPageHeader
        label={orgName}
        title="Team roadmaps"
        description={`Every learning roadmap published inside ${orgName} lives here. See who is actively taking each path, track your own progress, and filter to roadmaps you created for the team.`}
        icon={MapPinned}
      />

      <RoadmapInfoCallout icon={Users} title="Shared by your organization">
        Members can create roadmaps for roles, skills, or initiatives. Each card
        shows colleagues currently enrolled and your personal completion
        percentage. Progress you mark complete is saved to your profile only—other
        members keep their own percentages.
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
        <Button asChild size="sm" className="gap-1.5 shrink-0">
          <Link href="/dashboard/learning-path/new-roadmap">
            <Plus className="h-4 w-4" />
            Create roadmap
          </Link>
        </Button>
      </div>

      <p className="text-label mb-6 text-muted-foreground">
        {filtered.length} roadmap{filtered.length === 1 ? "" : "s"}
        {filter === "all" && enrolledCount > 0
          ? ` · You are taking ${enrolledCount}`
          : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="vs-surface rounded-md border border-dashed border-border px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">
            {filter === "created-by-me"
              ? "You have not created any roadmaps for this organization yet"
              : "No team roadmaps yet"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {filter === "created-by-me"
              ? "Switch to “All team roadmaps” to browse paths started by colleagues, or create one to share with the org."
              : "Be the first to publish a structured learning path for your colleagues."}
          </p>
          <Button asChild className="mt-6 gap-2" size="sm">
            <Link href="/dashboard/learning-path/new-roadmap">
              <Plus className="h-4 w-4" />
              Create roadmap
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((roadmap) => (
            <OrgRoadmapPathCard
              key={roadmap.id}
              roadmap={{
                ...roadmap,
                icon: getIcon(roadmap.iconName),
                myProgress: getMyProgress(roadmap, userId),
                isCreatedByMe: isCreatedByUser(roadmap, userId),
                isEnrolled: isEnrolledInRoadmap(roadmap, userId),
                onToggleResource: (mId, rId) =>
                  handleToggleResource(roadmap.id, mId, rId),
              }}
              isExpanded={expandedPathIds.includes(roadmap.id)}
              onToggleExpand={handleToggleExpand}
              onViewDetails={(id) =>
                router.push(
                  `/dashboard/organization/${orgId}/roadmaps/${id}`,
                )
              }
              showTeamEnrollment
            />
          ))}
        </div>
      )}
    </div>
  );
}
