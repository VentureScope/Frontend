"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { getCurrentMemberFromList } from "@/lib/organization-member-service";
import { parseOrganizationMembers } from "@/lib/organization-member-parsers";
import { toOrganizationProfile } from "@/lib/organization-profile-mapper";
import { parseOrganizationOutApi } from "@/lib/organization-response-parsers";
import {
  getOrganization,
  listOrganizationMembers,
} from "@/lib/organizations-api";
import { ALL_ORGS_FILTER } from "@/components/organization/OrganizationOrgFilter";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";
import { useAppStore } from "@/store/useAppStore";
import type { OrganizationListItem } from "@/types/organization";
import type { UserOrganizationContext } from "@/types/organization-profile";

export type MyOrgMemberContext = {
  org: OrganizationListItem;
  ctx: UserOrganizationContext;
  techStacks: string[];
};

function memberToContext(
  orgId: string,
  member: NonNullable<ReturnType<typeof getCurrentMemberFromList>>,
  techStacks: string[],
): UserOrganizationContext {
  const skills = member.skills.filter(Boolean);
  const benchmarks = skills.map((skill, i) => ({
    skill,
    yourScore: 70 + Math.min(i * 3, 15),
    roleMedian: 65 + Math.min(i * 2, 10),
    orgTop: 82 + Math.min(i, 8),
    techTags: [skill],
  }));

  return {
    orgId,
    role: member.role,
    jobTitle: member.jobTitle || "Team member",
    memberSince: member.joinedAt,
    roadmapsEnrolled: member.roadmapsEnrolled ?? 0,
    roadmapsCreated: member.roadmapsCreated ?? 0,
    peerGroupLabel: member.jobTitle || "Team member",
    strengthSummary: skills.length
      ? `Your declared skills in this org: ${skills.join(", ")}.`
      : "Add skills to your profile to see comparative skill intelligence.",
    developerInsight: member.githubUsername
      ? `GitHub @${member.githubUsername}`
      : "Connect GitHub in settings for developer signals.",
    growthAreas: techStacks.slice(0, 3).map((s) => `Build depth in ${s}`),
    skillBenchmarks: benchmarks,
  };
}

export function useMyOrganizationMemberContexts(orgFilter: string) {
  const { organizations, loading: orgsLoading } = useOrganizationsList();
  const authUser = useAppStore((s) => s.authData.user);
  const authUserId = authUser?.id ?? null;
  const authUserEmail = authUser?.email?.toLowerCase() ?? null;

  const [contexts, setContexts] = useState<MyOrgMemberContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetOrgs = useMemo(() => {
    if (orgFilter === ALL_ORGS_FILTER) return organizations;
    return organizations.filter((o) => o.id === orgFilter);
  }, [organizations, orgFilter]);

  const reload = useCallback(async () => {
    if (targetOrgs.length === 0) {
      setContexts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rows = await Promise.all(
        targetOrgs.map(async (org) => {
          try {
            const [orgOut, membersRaw] = await Promise.all([
              getOrganization(org.id),
              listOrganizationMembers(org.id),
            ]);
            const parsedOrg = parseOrganizationOutApi(orgOut);
            const profile = parsedOrg
              ? toOrganizationProfile(parsedOrg)
              : null;
            const members = parseOrganizationMembers(
              membersRaw,
              authUserId,
              authUserEmail,
            );
            const current = getCurrentMemberFromList(members);
            if (!current) return null;

            const ctx = memberToContext(
              org.id,
              current,
              profile?.techStacks ?? [],
            );
            return {
              org,
              ctx,
              techStacks: profile?.techStacks ?? [],
            } satisfies MyOrgMemberContext;
          } catch {
            return null;
          }
        }),
      );

      setContexts(rows.filter((r): r is MyOrgMemberContext => r !== null));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setContexts([]);
    } finally {
      setLoading(false);
    }
  }, [targetOrgs, authUserId, authUserEmail]);

  useEffect(() => {
    if (!orgsLoading) {
      void reload();
    }
  }, [reload, orgsLoading]);

  return {
    contexts,
    organizations,
    loading: loading || orgsLoading,
    error,
    reload,
  };
}
