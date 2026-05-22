"use client";

import { Briefcase, Clock, Mail, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OrganizationInvitesListSkeleton } from "@/components/organization/OrganizationSkeletons";
import type { SentOrganizationInvite } from "@/types/organization-sent-invite";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/auth-api";

function emailInitial(email: string): string {
  const local = email.split("@")[0] ?? "?";
  return local.slice(0, 2).toUpperCase();
}

function formatSentDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type PendingInvitationsSectionProps = {
  invites: SentOrganizationInvite[];
  loading?: boolean;
  error?: string | null;
  cancellingId?: string | null;
  onCancel?: (inviteId: string) => Promise<void>;
  className?: string;
};

export function PendingInvitationsSection({
  invites,
  loading = false,
  error = null,
  cancellingId = null,
  onCancel,
  className,
}: PendingInvitationsSectionProps) {
  if (loading) {
    return (
      <div className={cn("mb-10", className)}>
        <OrganizationInvitesListSkeleton count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <p className={cn("mb-6 text-sm text-destructive", className)}>{error}</p>
    );
  }

  if (invites.length === 0) {
    return null;
  }

  async function handleCancel(inviteId: string) {
    if (!onCancel || cancellingId) return;
    try {
      await onCancel(inviteId);
      toast.success("Invitation cancelled.");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <section
      className={cn(
        "mb-10 overflow-hidden rounded-lg border border-primary/20 bg-primary/[0.04]",
        className,
      )}
      aria-labelledby="pending-invites-heading"
    >
      <div className="flex flex-col gap-1 border-b border-primary/15 bg-primary/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Send className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2
              id="pending-invites-heading"
              className="text-sm font-semibold text-foreground"
            >
              Pending invitations
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {invites.length} invite{invites.length === 1 ? "" : "s"} awaiting
              acceptance — not yet on the team.
            </p>
          </div>
        </div>
        <span className="vs-badge-accent mt-2 w-fit shrink-0 sm:mt-0">
          Awaiting response
        </span>
      </div>

      <ul className="divide-y divide-border/80 px-2 py-1 sm:px-3">
        {invites.map((invite) => (
          <li key={invite.id} className="px-2 py-3 sm:px-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-card text-xs font-bold text-primary"
                  aria-hidden
                >
                  {emailInitial(invite.inviteeEmail)}
                </span>
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      {invite.inviteeEmail}
                    </p>
                    <span className="vs-badge-warning text-[10px] font-semibold uppercase tracking-wide">
                      {invite.status}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="h-3 w-3" aria-hidden />
                    Expires {formatSentDate(invite.expiresAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-14 sm:pl-0">
                <p className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  Sent {formatSentDate(invite.sentAt)}
                </p>
                {onCancel ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={cancellingId === invite.id}
                    onClick={() => void handleCancel(invite.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                    {cancellingId === invite.id ? "…" : "Cancel"}
                  </Button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
