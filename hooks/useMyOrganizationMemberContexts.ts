"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { getCurrentMemberFromList } from "@/lib/organization-member-service";
import { parseOrganizationMembers } from "@/lib/organization-member-parsers";
import { toOrganizationProfile } from "@/lib/organization-profile-mapper";
import { ALL_ORGS_FILTER } from "@/components/organization/OrganizationOrgFilter";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";
import { queryKeys } from "@/lib/query-keys";
import {
  fetchOrganizationDetail,
  fetchOrganizationMembers,
} from "@/lib/queries/organizations";
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

async function fetchMyOrgMemberContexts(
  targetOrgs: OrganizationListItem[],
  authUserId: string | null,
  authUserEmail: string | null,
  queryClient: QueryClient,
): Promise<MyOrgMemberContext[]> {
  const rows = await Promise.all(
    targetOrgs.map(async (org) => {
      try {
        const [detailResult, membersResult] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: queryKeys.organizations.detail(org.id),
            queryFn: () => fetchOrganizationDetail(org.id),
          }),
          queryClient.fetchQuery({
            queryKey: [
              ...queryKeys.organizations.members(org.id),
              authUserId ?? "",
              authUserEmail ?? "",
            ],
            queryFn: () =>
              fetchOrganizationMembers(org.id, authUserId, authUserEmail),
          }),
        ]);

        if (detailResult.kind !== "ok") return null;

        const profile = toOrganizationProfile(detailResult.data);
        const members = membersResult.members;
        const current = getCurrentMemberFromList(members);
        if (!current) return null;

        const ctx = memberToContext(
          org.id,
          current,
          profile.techStacks ?? [],
        );
        return {
          org,
          ctx,
          techStacks: profile.techStacks ?? [],
        } satisfies MyOrgMemberContext;
      } catch {
        return null;
      }
    }),
  );

  return rows.filter((r): r is MyOrgMemberContext => r !== null);
}

export function useMyOrganizationMemberContexts(orgFilter: string) {
  const queryClient = useQueryClient();
  const { organizations, loading: orgsLoading } = useOrganizationsList();
  const authUser = useAppStore((s) => s.authData.user);
  const authUserId = authUser?.id ?? null;
  const authUserEmail = authUser?.email?.toLowerCase() ?? null;

  const targetOrgs = useMemo(() => {
    if (orgFilter === ALL_ORGS_FILTER) return organizations;
    return organizations.filter((o) => o.id === orgFilter);
  }, [organizations, orgFilter]);

  const orgIdsKey = useMemo(
    () => targetOrgs.map((o) => o.id).sort().join(","),
    [targetOrgs],
  );

  const contextsQuery = useQuery({
    queryKey: queryKeys.organizations.myMemberContexts(
      orgFilter,
      orgIdsKey,
      authUserId ?? "",
    ),
    queryFn: () =>
      fetchMyOrgMemberContexts(
        targetOrgs,
        authUserId,
        authUserEmail,
        queryClient,
      ),
    enabled: !orgsLoading && targetOrgs.length > 0 && Boolean(authUserId),
  });

  return {
    contexts:
      targetOrgs.length === 0 ? [] : (contextsQuery.data ?? []),
    organizations,
    loading:
      orgsLoading ||
      (targetOrgs.length > 0 && contextsQuery.isPending),
    error: contextsQuery.error
      ? getApiErrorMessage(contextsQuery.error)
      : null,
    reload: () => contextsQuery.refetch(),
  };
}
