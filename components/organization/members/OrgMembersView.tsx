"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import { InviteMemberDialog } from "@/components/organization/members/InviteMemberDialog";
import { OrgMemberCard } from "@/components/organization/members/OrgMemberCard";
import { PendingInvitationsSection } from "@/components/organization/members/PendingInvitationsSection";
import { Button } from "@/components/ui/button";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { canInviteMembers } from "@/lib/organization-invite-service";
import { getSentInvitesForOrg } from "@/lib/organization-sent-invites-storage";
import type { SentOrganizationInvite } from "@/types/organization-sent-invite";

type Props = {
  orgId: string;
  orgName: string;
};

export function OrgMembersView({ orgId, orgName }: Props) {
  const { members, refresh } = useOrganizationMembers(orgId);
  const canInvite = canInviteMembers(orgId);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [sentInvites, setSentInvites] = useState<SentOrganizationInvite[]>([]);

  const refreshSentInvites = useCallback(() => {
    setSentInvites(getSentInvitesForOrg(orgId));
  }, [orgId]);

  useEffect(() => {
    refreshSentInvites();
  }, [refreshSentInvites]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href={`/dashboard/organization/${orgId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {orgName}
      </Link>

      <OrganizationPageHeader
        label={orgName}
        title="Members"
        description="Everyone with access to this organization workspace. Open a member to view company intelligence, change roles, or remove them from the team."
        icon={Users}
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        {canInvite ? (
          <Button
            size="sm"
            className="gap-1.5 sm:ml-auto"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Only owners and admins can invite members.
          </p>
        )}
      </div>

      <PendingInvitationsSection invites={sentInvites} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Active members</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {members.length} person{members.length === 1 ? "" : "s"} on this team
            </p>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="vs-surface rounded-md border border-dashed border-border px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">No members yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Invite colleagues to collaborate on roadmaps and company profile.
            </p>
            {canInvite && (
              <Button
                type="button"
                className="mt-6 gap-1.5"
                onClick={() => setInviteOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Invite member
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member.id}>
                <OrgMemberCard orgId={orgId} member={member} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <InviteMemberDialog
        orgId={orgId}
        orgName={orgName}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSent={() => {
          refreshSentInvites();
          refresh();
        }}
      />
    </div>
  );
}
