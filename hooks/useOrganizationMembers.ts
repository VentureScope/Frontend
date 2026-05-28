"use client";

import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { getCurrentMemberFromList, canInviteMembers } from "@/lib/organization-member-service";
import { queryKeys } from "@/lib/query-keys";
import { fetchOrganizationMembers } from "@/lib/queries/organizations";
import { useAppStore } from "@/store/useAppStore";

export function useOrganizationMembers(orgId: string) {
  const authUser = useAppStore((s) => s.authData.user);
  const authUserId = authUser?.id ?? null;
  const authUserEmail = authUser?.email?.toLowerCase() ?? null;

  const query = useQuery({
    queryKey: [
      ...queryKeys.organizations.members(orgId),
      authUserId ?? "",
      authUserEmail ?? "",
    ],
    queryFn: () =>
      fetchOrganizationMembers(orgId, authUserId, authUserEmail),
    enabled: Boolean(orgId),
  });

  const members = query.data?.members ?? [];
  const myRole = query.data?.myRole ?? "member";
  const currentMember = getCurrentMemberFromList(members);
  const canInvite = canInviteMembers(myRole);

  return {
    members,
    myRole,
    currentMember,
    currentUserId: authUserId,
    canInvite,
    loading: query.isPending,
    error: query.error ? getApiErrorMessage(query.error) : null,
    reload: () => query.refetch(),
  };
}
