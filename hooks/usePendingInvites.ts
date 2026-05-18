"use client";

import { useCallback, useEffect, useState } from "react";
import type { OrganizationInvite } from "@/types/organization-invite";
import {
  loadPendingInvites,
  removePendingInvite as removeFromStorage,
  savePendingInvites,
} from "@/lib/organization-invites-storage";

export function usePendingInvites() {
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setInvites(loadPendingInvites());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeInvite = useCallback(
    (id: string) => {
      const next = removeFromStorage(id);
      setInvites(next);
      return next;
    },
    [],
  );

  const resetInvites = useCallback((list: OrganizationInvite[]) => {
    savePendingInvites(list);
    setInvites(list);
  }, []);

  return {
    invites,
    count: invites.length,
    ready,
    refresh,
    removeInvite,
    resetInvites,
  };
}
