"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseMyOrganizationInvites } from "@/lib/organization-invite-parsers";
import { listMyOrganizationInvites } from "@/lib/organizations-api";

/** Legacy route — resolve invite token then forward to accept flow. */
export function PendingInviteDetailView({ inviteId }: { inviteId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("Redirecting to accept invitation…");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const trimmed = inviteId.trim();
      if (!trimmed) {
        router.replace("/dashboard/organization/invites");
        return;
      }

      try {
        const data = await listMyOrganizationInvites();
        const invites = parseMyOrganizationInvites(data);
        const invite =
          invites.find((item) => item.id === trimmed) ??
          invites.find((item) => item.token === trimmed);

        if (cancelled) return;

        if (invite) {
          router.replace(
            `/dashboard/organization/invites/accept?token=${encodeURIComponent(invite.token)}`,
          );
          return;
        }
      } catch {
        if (cancelled) return;
      }

      setMessage("Invitation not found. It may have expired or already been accepted.");
      router.replace("/dashboard/organization/invites");
    })();

    return () => {
      cancelled = true;
    };
  }, [inviteId, router]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
