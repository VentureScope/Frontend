"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseOrganizationInvites } from "@/lib/organization-member-parsers";
import {
  cancelOrganizationInvite,
  listOrganizationInvites,
} from "@/lib/organizations-api";
import type { SentOrganizationInvite } from "@/types/organization-sent-invite";

export function useOrganizationInvites(orgId: string, enabled = true) {
  const [invites, setInvites] = useState<SentOrganizationInvite[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!orgId || !enabled) {
      setInvites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listOrganizationInvites(orgId);
      setInvites(parseOrganizationInvites(data, orgId));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }, [orgId, enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const cancelInvite = useCallback(
    async (inviteId: string) => {
      setCancellingId(inviteId);
      try {
        await cancelOrganizationInvite(orgId, inviteId);
        setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      } catch (err) {
        throw err;
      } finally {
        setCancellingId(null);
      }
    },
    [orgId],
  );

  return {
    invites,
    loading,
    error,
    cancellingId,
    reload,
    cancelInvite,
  };
}
