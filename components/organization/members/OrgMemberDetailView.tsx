"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Shield,
  UserMinus,
} from "lucide-react";
import { MemberCompanyIntelligence } from "@/components/organization/members/MemberCompanyIntelligence";
import { RemoveMemberDialog } from "@/components/organization/members/RemoveMemberDialog";
import { OrganizationMembersListSkeleton } from "@/components/organization/OrganizationSkeletons";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { getOrganizationMemberProfile } from "@/lib/organization-member-details-data";
import { canRemoveMember } from "@/lib/organization-member-service";
import { formatMemberRole } from "@/lib/organization-member-format";
type Props = {
  orgId: string;
  memberId: string;
};

export function OrgMemberDetailView({ orgId, memberId }: Props) {
  const router = useRouter();
  const { organization } = useOrganization(orgId);
  const { profile: orgProfile } = useOrganizationProfile(orgId);
  const {
    members,
    myRole,
    currentUserId,
    loading,
    error,
    reload,
  } = useOrganizationMembers(orgId);
  const [removeOpen, setRemoveOpen] = useState(false);

  const orgName = organization?.displayName ?? "Organization";
  const member = members.find((m) => m.id === memberId) ?? null;
  const profile = useMemo(
    () => getOrganizationMemberProfile(orgId, member),
    [orgId, member],
  );

  const canRemove = useMemo(() => {
    if (!member || !currentUserId) return false;
    return canRemoveMember(myRole, member, currentUserId).allowed;
  }, [myRole, member, currentUserId]);

  function handleRemoved() {
    router.push(`/dashboard/organization/${orgId}/members`);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <OrganizationMembersListSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!member || !profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={`/dashboard/organization/${orgId}/members`}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Members
        </Link>
        <div className="vs-surface rounded-md border border-dashed border-border px-6 py-12 text-center">
          <p className="font-medium text-foreground">Member not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            They may have been removed from this organization.
          </p>
          <Button type="button" variant="outline" className="mt-6" asChild>
            <Link href={`/dashboard/organization/${orgId}/members`}>
              Back to members
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href={`/dashboard/organization/${orgId}/members`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Members · {orgName}
      </Link>

      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {member.profilePictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.profilePictureUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-foreground">
              {member.initials}
            </span>
          )}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1 text-foreground">{member.name}</h1>
              {member.isCurrentUser ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  You
                </span>
              ) : null}
            </div>
            <p className="text-sm font-medium text-foreground">{member.jobTitle}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {member.email}
            </p>
          </div>
        </div>

        {canRemove && currentUserId ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setRemoveOpen(true)}
          >
            <UserMinus className="h-3.5 w-3.5" />
            Remove
          </Button>
        ) : null}
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="vs-surface rounded-md p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Shield className="h-3 w-3" />
            Organization access
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {formatMemberRole(member.role)}
          </p>
        </div>
        <div className="vs-surface rounded-md p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Focus
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {member.jobTitle}
          </p>
        </div>
        <div className="vs-surface rounded-md p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Joined
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {new Date(member.joinedAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="vs-surface rounded-md p-4 sm:col-span-2 lg:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Declared skills
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {member.skills.length > 0 ? (
              member.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground">
            Company intelligence
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Learning progress and skill context within {orgName}.
          </p>
        </div>
        <MemberCompanyIntelligence
          profile={profile}
          orgName={orgName}
          techStacks={orgProfile?.techStacks}
        />
      </section>

      {currentUserId ? (
        <RemoveMemberDialog
          orgId={orgId}
          orgName={orgName}
          member={member}
          myRole={myRole}
          currentUserId={currentUserId}
          open={removeOpen}
          onOpenChange={setRemoveOpen}
          onRemoved={() => {
            void reload();
            handleRemoved();
          }}
        />
      ) : null}
    </div>
  );
}
