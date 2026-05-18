"use client";

import Link from "next/link";
import { ChevronRight, Mail } from "lucide-react";
import { formatMemberRole } from "@/lib/organization-members-data";
import type { OrganizationMember } from "@/types/organization-profile";

type OrgMemberCardProps = {
  orgId: string;
  member: OrganizationMember;
};

export function OrgMemberCard({ orgId, member }: OrgMemberCardProps) {
  return (
    <Link
      href={`/dashboard/organization/${orgId}/members/${member.id}`}
      className="vs-surface group flex flex-col gap-4 rounded-md border border-border p-5 transition-colors hover:border-primary/25 hover:bg-primary/[0.02] sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
          {member.initials}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary">
              {member.name}
            </p>
            {member.isCurrentUser && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                You
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{member.jobTitle}</p>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            {member.email}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {formatMemberRole(member.role)}
          </span>
          <p className="text-[10px] text-muted-foreground">
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </p>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
          View profile
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
