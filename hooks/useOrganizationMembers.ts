"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { cacheMemberName } from "@/lib/organization-label-cache";
import {
  getCurrentMemberFromList,
  canInviteMembers,
} from "@/lib/organization-member-service";
import { parseOrganizationMembers } from "@/lib/organization-member-parsers";
import { parseOrganizationRole } from "@/lib/organization-permissions";
import { listOrganizationMembers } from "@/lib/organizations-api";
import { useAppStore } from "@/store/useAppStore";
import type { OrganizationRole } from "@/types/organization";
import type { OrganizationMember } from "@/types/organization-profile";

export function useOrganizationMembers(orgId: string) {
  const authUser = useAppStore((s) => s.authData.user);
  const authUserId = authUser?.id ?? null;
  const authUserEmail = authUser?.email?.toLowerCase() ?? null;

  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [myRole, setMyRole] = useState<OrganizationRole>("member");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!orgId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listOrganizationMembers(orgId);
      const parsed = parseOrganizationMembers(data, authUserId, authUserEmail);
      for (const m of parsed) {
        cacheMemberName(orgId, m.id, m.name);
      }
      setMembers(parsed);
      const current = getCurrentMemberFromList(parsed);
      setMyRole(current?.role ?? parseOrganizationRole("member"));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [orgId, authUserId, authUserEmail]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const currentMember = getCurrentMemberFromList(members);
  const canInvite = canInviteMembers(myRole);

  return {
    members,
    myRole,
    currentMember,
    currentUserId: authUserId,
    canInvite,
    loading,
    error,
    reload,
  };
}
