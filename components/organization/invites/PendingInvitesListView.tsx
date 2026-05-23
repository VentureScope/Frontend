"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OrganizationInvitesListSkeleton } from "@/components/organization/OrganizationSkeletons";
import { usePendingInvites } from "@/hooks/usePendingInvites";
import { getApiErrorMessage } from "@/lib/auth-api";
import { useAcceptOrganizationInvite } from "@/hooks/useAcceptOrganizationInvite";
import { declineOrganizationInvite } from "@/lib/organizations-api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PendingInvitesListView() {
  const router = useRouter();
  const { invites, loading, error, refresh } = usePendingInvites();
  const { accept, accepting } = useAcceptOrganizationInvite();

  async function handleAccept(token: string) {
    try {
      const orgId = await accept(token);
      toast.success("You joined the organization.");
      await refresh();
      router.push(`/dashboard/organization/${orgId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not accept invite.");
    }
  }

  async function handleDecline(token: string) {
    try {
      await declineOrganizationInvite({ token });
      toast.success("Invitation declined.");
      await refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/dashboard/organization"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Your organizations
      </Link>

      <header className="mb-8 max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Mail className="h-5 w-5" />
          <span className="text-label">Invitations</span>
        </div>
        <h1 className="text-h1 text-foreground">Organization invites</h1>
        <p className="text-body text-muted-foreground">
          Review invitations sent to your account and join organizations from here.
        </p>
      </header>

      {loading ? <OrganizationInvitesListSkeleton count={3} /> : null}
      {error ? <p className="mb-6 text-sm text-destructive">{error}</p> : null}

      {!loading && !error && invites.length === 0 ? (
        <div className="vs-surface rounded-md border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No pending invitations</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            When someone invites you to an organization, it will show up here.
            You can also accept from the link in your email.
          </p>
          <Button type="button" className="mt-6" asChild>
            <Link href="/dashboard/organization/invites/accept">Accept with token</Link>
          </Button>
        </div>
      ) : null}

      {!loading && invites.length > 0 ? (
        <ul className="space-y-4">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="vs-surface rounded-md border border-border p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                    {invite.organizationLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={invite.organizationLogo}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {invite.organizationName}
                    </p>
                    {invite.organizationIndustry ? (
                      <p className="text-xs text-muted-foreground">
                        {invite.organizationIndustry}
                      </p>
                    ) : null}
                    {invite.teamRole ? (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        {invite.teamRole}
                      </p>
                    ) : null}
                    {invite.inviterName ? (
                      <p className="text-xs text-muted-foreground">
                        Invited by {invite.inviterName}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Expires {formatDate(invite.expiresAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={accepting}
                    onClick={() => void handleAccept(invite.token)}
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={accepting}
                    onClick={() => void handleDecline(invite.token)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
