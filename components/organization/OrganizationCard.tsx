import Link from "next/link";
import {
  ArrowRight,
  MoreVertical,
  Shield,
  UserCog,
} from "lucide-react";
import type { OrganizationListItem } from "@/types/organization";
import { cn } from "@/lib/utils";

function formatCount(value: number): string {
  return value.toLocaleString();
}

function RoleBadge({ role }: { role: OrganizationListItem["role"] }) {
  const isOwner = role === "owner";

  return (
    <span
      className={cn(
        "vs-badge inline-flex items-center gap-1",
        isOwner ? "vs-badge-success" : "vs-badge-neutral",
      )}
    >
      {isOwner ? (
        <Shield className="h-3 w-3 shrink-0" aria-hidden />
      ) : (
        <UserCog className="h-3 w-3 shrink-0" aria-hidden />
      )}
      {role.toUpperCase()}
    </span>
  );
}

export function OrganizationCard({ org }: { org: OrganizationListItem }) {
  return (
    <article className="vs-surface flex flex-col rounded-md p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs font-bold text-muted-foreground"
            aria-hidden
          >
            {org.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 space-y-2">
            <h2 className="truncate text-base font-semibold text-foreground">
              {org.name}
            </h2>
            <RoleBadge role={org.role} />
          </div>
        </div>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`${org.name} options`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Members
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
            {formatCount(org.memberCount)}
          </p>
        </div>
        <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Active Projects
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
            {formatCount(org.activeProjects)}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center -space-x-2">
          {org.memberAvatars.map((member) => (
            <span
              key={member.initials}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-foreground"
              title={member.initials}
            >
              {member.initials}
            </span>
          ))}
          {org.extraMemberCount != null && org.extraMemberCount > 0 && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary/15 text-[10px] font-bold text-primary">
              +{org.extraMemberCount}
            </span>
          )}
        </div>
        <Link
          href={`/dashboard/organization/${org.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
        >
          View dashboard
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
