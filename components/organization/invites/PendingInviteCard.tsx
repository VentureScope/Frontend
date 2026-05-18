import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { OrganizationInvite } from "@/types/organization-invite";
import { InviteAssignmentSummary } from "@/components/organization/invites/InviteAssignmentSummary";

function formatCount(value: number): string {
  return value.toLocaleString();
}

function formatInviteDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PendingInviteCard({ invite }: { invite: OrganizationInvite }) {
  return (
    <article className="vs-surface flex flex-col rounded-md border border-primary/15 p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-xs font-bold text-primary"
            aria-hidden
          >
            {invite.organizationName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 space-y-2">
            <h2 className="truncate text-base font-semibold text-foreground">
              {invite.organizationName}
            </h2>
            <InviteAssignmentSummary invite={invite} variant="compact" />
          </div>
        </div>
        <span className="vs-badge-accent shrink-0 text-[10px] font-semibold uppercase tracking-wide">
          Pending
        </span>
      </div>

      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
        {invite.tagline}
      </p>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Members
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
            {formatCount(invite.memberCount)}
          </p>
        </div>
        <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Active Projects
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
            {formatCount(invite.activeProjects)}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>
          Invited {formatInviteDate(invite.sentAt)} by{" "}
          <span className="font-medium text-foreground">{invite.invitedBy}</span>
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center -space-x-2">
          {invite.memberAvatars.map((member) => (
            <span
              key={member.initials}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-foreground"
              title={member.initials}
            >
              {member.initials}
            </span>
          ))}
          {invite.extraMemberCount != null && invite.extraMemberCount > 0 && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary/15 text-[10px] font-bold text-primary">
              +{invite.extraMemberCount}
            </span>
          )}
        </div>
        <Link
          href={`/dashboard/organization/invites/${invite.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
        >
          Review invitation
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
