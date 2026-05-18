"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, Users } from "lucide-react";
import {
  ALL_ORGS_FILTER,
  OrganizationOrgFilter,
} from "@/components/organization/OrganizationOrgFilter";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import { OrgMemberProfileSection } from "@/components/organization/profile/OrgMemberProfileSection";
import { RoadmapInfoCallout } from "@/components/organization/roadmaps/RoadmapInfoCallout";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";
import { getUserOrgContext } from "@/lib/organization-member-profile-data";
import { useAppStore } from "@/store/useAppStore";

export function MyOrganizationMemberProfileView() {
  const authUser = useAppStore((s) => s.authData.user);
  const displayName = authUser?.full_name ?? "Member";
  const [orgFilter, setOrgFilter] = useState(ALL_ORGS_FILTER);

  const contexts = useMemo(() => {
    const orgIds =
      orgFilter === ALL_ORGS_FILTER
        ? MOCK_ORGANIZATIONS.map((o) => o.id)
        : [orgFilter];
    return orgIds
      .map((id) => getUserOrgContext(id))
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [orgFilter]);

  const selectedOrgName =
    orgFilter === ALL_ORGS_FILTER
      ? null
      : MOCK_ORGANIZATIONS.find((o) => o.id === orgFilter)?.name;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrganizationPageHeader
        label="Organization"
        title="My organization profile"
        description={`${displayName}, this is how you show up inside each organization you have joined—your role, skill signals compared to peers in the same job family, and developer activity in that company’s context.`}
        icon={Users}
      />

      <RoadmapInfoCallout icon={BarChart3} title="Context-aware analytics">
        Skill distribution is shown as a pie chart—each slice is your relative
        strength in a skill for the selected tech stack. Use organization and
        tech stack filters to focus on one company’s context at a time.
      </RoadmapInfoCallout>

      <OrganizationOrgFilter
        organizations={MOCK_ORGANIZATIONS}
        value={orgFilter}
        onChange={setOrgFilter}
        className="mt-8"
      />

      {contexts.length === 0 ? (
        <div className="vs-surface mt-10 rounded-md border border-dashed border-border px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">
            {selectedOrgName
              ? `No member profile data for ${selectedOrgName} yet`
              : "Join an organization to see your contextual profile"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Once you are a member, we surface skill benchmarks, roadmap activity,
            and developer signals relative to teammates in the same role.
          </p>
          <Link
            href="/dashboard/organization"
            className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Browse organizations
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {contexts.map((ctx) => {
            const org = MOCK_ORGANIZATIONS.find((o) => o.id === ctx.orgId);
            if (!org) return null;
            return (
              <OrgMemberProfileSection key={ctx.orgId} ctx={ctx} org={org} />
            );
          })}
        </div>
      )}
    </div>
  );
}
