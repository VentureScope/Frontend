"use client";

import { useCallback, useEffect, useState } from "react";
import { loadOrganizationMembers } from "@/lib/organization-members-storage";
import type { OrganizationMember } from "@/types/organization-profile";

export function useOrganizationMembers(orgId: string) {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setMembers(loadOrganizationMembers(orgId));
    setReady(true);
  }, [orgId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { members, ready, refresh };
}
