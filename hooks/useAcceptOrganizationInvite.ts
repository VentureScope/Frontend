"use client";

import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseOrganizationOutApi } from "@/lib/organization-response-parsers";
import { acceptOrganizationInvite } from "@/lib/organizations-api";

export function useAcceptOrganizationInvite() {
  const [accepting, setAccepting] = useState(false);

  const accept = useCallback(async (token: string) => {
    const trimmed = token.trim();
    if (!trimmed) {
      throw new Error("Invite token is required.");
    }

    setAccepting(true);
    try {
      const data = await acceptOrganizationInvite({ token: trimmed });
      const parsed = parseOrganizationOutApi(data);
      if (!parsed) {
        throw new Error("Invitation accepted but the response was invalid.");
      }
      return parsed.id;
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    } finally {
      setAccepting(false);
    }
  }, []);

  return { accept, accepting };
}
