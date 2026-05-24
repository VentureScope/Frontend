"use client";

import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseAcceptInviteOrganizationId } from "@/lib/organization-invite-parsers";
import {
  acceptOrganizationInvite,
  listMyOrganizations,
} from "@/lib/organizations-api";
import { parseOrganizationListItems } from "@/lib/organization-response-parsers";

export type AcceptOrganizationInviteOptions = {
  /** From preview or my-invites when accept returns an empty body. */
  fallbackOrganizationId?: string | null;
};

async function resolveOrganizationIdAfterAccept(
  raw: unknown,
  fallbackOrganizationId?: string | null,
): Promise<string | null> {
  const parsed = parseAcceptInviteOrganizationId(raw, fallbackOrganizationId);
  if (parsed) {
    return parsed;
  }

  const fallback = fallbackOrganizationId?.trim();
  if (fallback) {
    return fallback;
  }

  try {
    const orgs = parseOrganizationListItems(await listMyOrganizations());
    if (orgs.length === 1) {
      return orgs[0].id;
    }
  } catch {
    // Non-fatal — caller shows a helpful error.
  }

  return null;
}

export function useAcceptOrganizationInvite() {
  const [accepting, setAccepting] = useState(false);

  const accept = useCallback(
    async (token: string, options?: AcceptOrganizationInviteOptions) => {
      const trimmed = token.trim();
      if (!trimmed) {
        throw new Error("Invite token is required.");
      }

      setAccepting(true);
      try {
        const data = await acceptOrganizationInvite({ token: trimmed });
        const orgId = await resolveOrganizationIdAfterAccept(
          data,
          options?.fallbackOrganizationId,
        );
        if (!orgId) {
          throw new Error(
            "Invitation accepted. Open Your organizations from the menu to continue.",
          );
        }
        return orgId;
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      } finally {
        setAccepting(false);
      }
    },
    [],
  );

  return { accept, accepting };
}
