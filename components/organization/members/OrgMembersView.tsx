"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import { OrganizationMembersListSkeleton } from "@/components/organization/OrganizationSkeletons";
import { InviteMemberDialog } from "@/components/organization/members/InviteMemberDialog";
import { OrgMemberCard } from "@/components/organization/members/OrgMemberCard";
import { PendingInvitationsSection } from "@/components/organization/members/PendingInvitationsSection";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationInvites } from "@/hooks/useOrganizationInvites";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";

type Props = {
  orgId: string;
};

export function OrgMembersView({ orgId }: Props) {
  const { organization, loading: orgLoading } = useOrganization(orgId);
  const {
    members,
    canInvite,
    myRole,
    loading,
    error,
    reload,
  } = useOrganizationMembers(orgId);
  const {
    invites,
    loading: invitesLoading,
    error: invitesError,
    cancellingId,
    resendingId,
    cancelInvite,
    resendInvite,
    reload: reloadInvites,
  } = useOrganizationInvites(orgId, canInvite);

  const [inviteOpen, setInviteOpen] = useState(false);

  const orgName = organization?.displayName ?? "Organization";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href={`/dashboard/organization/${orgId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {orgLoading ? "…" : orgName}
      </Link>

      <OrganizationPageHeader
        label={orgName}
        title="Members"
        description="Everyone with access to this organization workspace. Open a member to view their profile or remove them from the team."
        icon={Users}
      />

      {error ? (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

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
            Only the organization owner can send invitations.
          </p>
        )}
      </div>

      {canInvite ? (
        <PendingInvitationsSection
          invites={invites}
          loading={invitesLoading}
          error={invitesError}
          cancellingId={cancellingId}
          resendingId={resendingId}
          onCancel={async (inviteId) => {
            await cancelInvite(inviteId);
          }}
          onResend={async (inviteId) => {
            await resendInvite(inviteId);
          }}
        />
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Active members</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {loading
                ? "Loading…"
                : `${members.length} person${members.length === 1 ? "" : "s"} on this team`}
            </p>
          </div>
        </div>

        {loading ? (
          <OrganizationMembersListSkeleton count={4} />
        ) : members.length === 0 ? (
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
          void reloadInvites();
          void reload();
        }}
      />
    </div>
  );
}
