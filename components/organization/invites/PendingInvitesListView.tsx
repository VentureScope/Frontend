"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PendingInviteCard } from "@/components/organization/invites/PendingInviteCard";
import { usePendingInvites } from "@/hooks/usePendingInvites";

export function PendingInvitesListView() {
  const { invites, ready } = usePendingInvites();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/dashboard/organization"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Your organizations
      </Link>

      <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Mail className="h-5 w-5" />
            <span className="text-label">Invitations</span>
          </div>
          <h1 className="text-h1 text-foreground">Pending invites</h1>
          <p className="text-body text-muted-foreground">
            Organizations that invited you to join their team. Open an
            invitation to review details, then accept or decline.
          </p>
        </div>
      </header>

      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading invitations…</p>
      ) : invites.length === 0 ? (
        <div className="vs-surface rounded-md border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No pending invites</p>
          <p className="mt-2 text-sm text-muted-foreground">
            When someone invites you to their organization, it will show up here.
          </p>
          <Button type="button" variant="outline" className="mt-6" asChild>
            <Link href="/dashboard/organization">Back to organizations</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {invites.map((invite) => (
            <PendingInviteCard key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
}
