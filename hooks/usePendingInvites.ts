"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseMyOrganizationInvites } from "@/lib/organization-invite-parsers";
import { listMyOrganizationInvites } from "@/lib/organizations-api";
import type { PendingOrganizationInvite } from "@/types/organization-pending-invite";

export function usePendingInvites() {
  const [invites, setInvites] = useState<PendingOrganizationInvite[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMyOrganizationInvites();
      setInvites(parseMyOrganizationInvites(data));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setInvites([]);
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    invites,
    count: invites.length,
    ready,
    loading,
    error,
    refresh,
  };
}
