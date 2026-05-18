"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Building2, Cloud, MapPinned, Plus } from "lucide-react";
import { TabNavigation } from "@/components/learning-path/TabNavigation";
import { OrgRoadmapPathCard } from "@/components/organization/roadmaps/OrgRoadmapPathCard";
import { RoadmapInfoCallout } from "@/components/organization/roadmaps/RoadmapInfoCallout";
import { useOrgRoadmapListState } from "@/components/organization/roadmaps/useOrgRoadmapListState";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import { Button } from "@/components/ui/button";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";
import { MOCK_ORGANIZATION_ROADMAPS } from "@/lib/organization-roadmaps-data";
import {
  filterMyRoadmaps,
  getMyProgress,
  groupRoadmapsByOrg,
  isCreatedByUser,
  isEnrolledInRoadmap,
  resolveCurrentUserId,
} from "@/lib/organization-roadmap-utils";
import type { MyRoadmapsTab } from "@/types/organization-roadmap";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const ALL_ORGS_FILTER = "all";

const MY_ROADMAP_TABS: { id: MyRoadmapsTab; name: string }[] = [
  { id: "all", name: "All" },
  { id: "enrolled", name: "Taking" },
  { id: "created", name: "Created by me" },
];

function getIcon(iconName: string) {
  switch (iconName) {
    case "Cloud":
      return <Cloud className="h-5 w-5 text-primary" />;
    default:
      return <BarChart3 className="h-5 w-5 text-primary" />;
  }
}

export function MyOrganizationRoadmapsView() {
  const router = useRouter();
  const authUser = useAppStore((s) => s.authData.user);
  const userId = resolveCurrentUserId(authUser?.id as string | undefined);
  const displayName = authUser?.full_name?.split(" ")[0] ?? "there";

  const [activeTab, setActiveTab] = useState<MyRoadmapsTab>("all");
  const [orgFilter, setOrgFilter] = useState<string>(ALL_ORGS_FILTER);
  const { paths, expandedPathIds, handleToggleExpand, handleToggleResource } =
    useOrgRoadmapListState(MOCK_ORGANIZATION_ROADMAPS);

  const selectedOrgName = useMemo(() => {
    if (orgFilter === ALL_ORGS_FILTER) {
      return null;
    }
    return MOCK_ORGANIZATIONS.find((o) => o.id === orgFilter)?.name ?? null;
  }, [orgFilter]);

  const filtered = useMemo(() => {
    const byTab = filterMyRoadmaps(paths, userId, activeTab);
    if (orgFilter === ALL_ORGS_FILTER) {
      return byTab;
    }
    return byTab.filter((r) => r.orgId === orgFilter);
  }, [paths, userId, activeTab, orgFilter]);

  const grouped = useMemo(() => {
    const orgs =
      orgFilter === ALL_ORGS_FILTER
        ? MOCK_ORGANIZATIONS
        : MOCK_ORGANIZATIONS.filter((o) => o.id === orgFilter);
    return groupRoadmapsByOrg(filtered, orgs);
  }, [filtered, orgFilter]);

  const handleViewDetails = (orgId: string, roadmapId: string) => {
    router.push(
      `/dashboard/organization/${orgId}/roadmaps/${roadmapId}`,
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrganizationPageHeader
        label="Organization"
        title="My organization roadmaps"
        description={`Hi ${displayName} — this is your personal view across every organization you belong to. Filter by organization, then use the tabs to see roadmaps you are taking or ones you created.`}
        icon={MapPinned}
      />

      <RoadmapInfoCallout icon={MapPinned} title="How this page differs from team roadmaps">
        Use this page when you want your own progress in one place. To browse
        everything shared by colleagues in a single organization—including
        roadmaps you have not joined yet—open that organization and go to{" "}
        <strong className="font-medium text-foreground">Team roadmaps</strong>.
      </RoadmapInfoCallout>

      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/dashboard/organization">View organizations</Link>
        </Button>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/dashboard/learning-path/new-roadmap">
            <Plus className="h-4 w-4" />
            New roadmap
          </Link>
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <p className="text-label text-muted-foreground">Filter by organization</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOrgFilter(ALL_ORGS_FILTER)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              orgFilter === ALL_ORGS_FILTER
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            All organizations
          </button>
          {MOCK_ORGANIZATIONS.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => setOrgFilter(org.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                orgFilter === org.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {org.name}
            </button>
          ))}
        </div>
      </div>

      <TabNavigation
        tabs={MY_ROADMAP_TABS}
        activeTabId={activeTab}
        onTabChange={(id) => setActiveTab(id as MyRoadmapsTab)}
      />

      {filtered.length > 0 && (
        <p className="text-label mt-6 text-muted-foreground">
          {filtered.length} roadmap{filtered.length === 1 ? "" : "s"}
          {selectedOrgName
            ? ` in ${selectedOrgName}`
            : " across your organizations"}
        </p>
      )}

      {grouped.length === 0 ? (
        <div className="vs-surface mt-10 rounded-md border border-dashed border-border px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">
            {selectedOrgName
              ? activeTab === "created"
                ? `You have not created any roadmaps in ${selectedOrgName}`
                : activeTab === "enrolled"
                  ? `You are not taking any roadmaps in ${selectedOrgName}`
                  : `No roadmaps to show in ${selectedOrgName}`
              : activeTab === "created"
                ? "You have not created any organization roadmaps yet"
                : activeTab === "enrolled"
                  ? "You are not enrolled in any organization roadmaps yet"
                  : "No organization roadmaps to show"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {selectedOrgName
              ? "Try another organization or tab, or open team roadmaps to join a path your colleagues published."
              : activeTab === "created"
                ? "When you publish a roadmap inside an organization workspace, it will appear here and on that org’s team roadmaps page."
                : "Join a roadmap from an organization’s team page, or create one and invite members to follow along."}
          </p>
          {selectedOrgName ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => setOrgFilter(ALL_ORGS_FILTER)}
            >
              Show all organizations
            </Button>
          ) : (
            <Button asChild className="mt-6 gap-2" size="sm">
              <Link href="/dashboard/organization">Browse organizations</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map(({ org, roadmaps }) => (
            <section key={org.id} className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
                <div>
                  <Link
                    href={`/dashboard/organization/${org.id}`}
                    className="text-lg font-semibold text-foreground hover:text-primary"
                  >
                    {org.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {roadmaps.length}{" "}
                    {roadmaps.length === 1 ? "roadmap" : "roadmaps"}
                    {orgFilter === ALL_ORGS_FILTER ? " in this view" : ""}
                    · Your role: {org.role}
                  </p>
                </div>
                <Link
                  href={`/dashboard/organization/${org.id}/roadmaps`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Team roadmaps →
                </Link>
              </div>

              <div className="space-y-6">
                {roadmaps.map((roadmap) => (
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
                    onViewDetails={(id) => handleViewDetails(org.id, id)}
                    showTeamEnrollment
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
