"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route — forward to token-based accept flow. */
export function PendingInviteDetailView({ inviteId }: { inviteId: string }) {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (inviteId.trim()) {
      params.set("token", inviteId.trim());
    }
    router.replace(
      `/dashboard/organization/invites/accept${params.toString() ? `?${params}` : ""}`,
    );
  }, [inviteId, router]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-muted-foreground">
      Redirecting to accept invitation…
    </div>
  );
}
