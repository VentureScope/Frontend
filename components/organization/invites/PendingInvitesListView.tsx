"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PendingInvitesListView() {
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
          <h1 className="text-h1 text-foreground">Organization invites</h1>
          <p className="text-body text-muted-foreground">
            Invitations arrive by email. Use the link in your message to review and
            join an organization — there is no separate inbox API yet.
          </p>
        </div>
      </header>

      <div className="vs-surface rounded-md border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Check your email</p>
        <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
          When you receive an invite, open the link in the email. It will bring you
          here to accept with your account. You can also paste the token from the
          link manually.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button type="button" asChild>
            <Link href="/dashboard/organization/invites/accept">
              Accept with token
            </Link>
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/organization">Back to organizations</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
