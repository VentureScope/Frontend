"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePendingInvites } from "@/hooks/usePendingInvites";

export function ExpandNetworkCard() {
  const { count, ready } = usePendingInvites();

  return (
    <article className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/50 px-6 py-10 text-center sm:py-12">
      <div className="vs-icon-tile-primary mb-4 flex h-14 w-14 items-center justify-center rounded-md">
        <Mail className="h-7 w-7" />
      </div>

      <h2 className="text-lg font-semibold text-foreground">Join a team</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Accept invitations to collaborate with organizations you&apos;ve been
        invited to.
      </p>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="mt-6 h-11 w-full max-w-xs font-semibold"
        asChild
      >
        <Link href="/dashboard/organization/invites">
          View pending invites{ready ? ` (${count})` : ""}
        </Link>
      </Button>
    </article>
  );
}
