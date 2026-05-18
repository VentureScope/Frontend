import { Mail, Shield, UserCog, Briefcase } from "lucide-react";
import type { OrganizationInvite } from "@/types/organization-invite";
import { cn } from "@/lib/utils";

type InviteAssignmentSummaryProps = {
  invite: OrganizationInvite;
  variant?: "compact" | "full";
  className?: string;
};

export function InviteAssignmentSummary({
  invite,
  variant = "compact",
  className,
}: InviteAssignmentSummaryProps) {
  const isAdmin = invite.accessRole === "admin";

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Briefcase className="h-3 w-3 shrink-0" aria-hidden />
            {invite.teamRole}
          </span>
          <span
            className={cn(
              "vs-badge inline-flex items-center gap-1 text-[10px]",
              isAdmin ? "vs-badge-success" : "vs-badge-neutral",
            )}
          >
            {isAdmin ? (
              <Shield className="h-3 w-3 shrink-0" aria-hidden />
            ) : (
              <UserCog className="h-3 w-3 shrink-0" aria-hidden />
            )}
            {invite.accessRole} access
          </span>
        </div>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{invite.inviteeEmail}</span>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
        <p className="text-label text-muted-foreground">Your team role</p>
        <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Briefcase className="h-5 w-5 text-primary" aria-hidden />
          {invite.teamRole}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This is the role you&apos;ll be listed under on the team after you accept.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-label text-muted-foreground">Invited email</dt>
          <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <Mail className="h-4 w-4 text-primary" aria-hidden />
            {invite.inviteeEmail}
          </dd>
        </div>
        <div>
          <dt className="text-label text-muted-foreground">Organization access</dt>
          <dd className="mt-1">
            <span
              className={cn(
                "vs-badge inline-flex items-center gap-1 capitalize",
                isAdmin ? "vs-badge-success" : "vs-badge-neutral",
              )}
            >
              {isAdmin ? (
                <Shield className="h-3 w-3" aria-hidden />
              ) : (
                <UserCog className="h-3 w-3" aria-hidden />
              )}
              {invite.accessRole}
            </span>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {isAdmin
                ? "Can manage members, company profile, and team roadmaps."
                : "Can participate in roadmaps and view org resources."}
            </p>
          </dd>
        </div>
      </dl>
    </div>
  );
}
