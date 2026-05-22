"use client";

import { useCallback, useEffect, useState } from "react";

/** Invitee pending list is not available in the API; count stays 0 until backend adds it. */
export function usePendingInvites() {
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    invites: [] as never[],
    count: 0,
    ready,
    refresh,
    removeInvite: () => [],
    resetInvites: () => {},
  };
}
