"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Github,
  Mail,
  Pencil,
  Shield,
  UserMinus,
} from "lucide-react";
import { EditMemberRoleDialog } from "@/components/organization/members/EditMemberRoleDialog";
import { MemberCompanyIntelligence } from "@/components/organization/members/MemberCompanyIntelligence";
import { RemoveMemberDialog } from "@/components/organization/members/RemoveMemberDialog";
import { Button } from "@/components/ui/button";
import { getOrganizationMemberProfile } from "@/lib/organization-member-details-data";
import {
  canEditMemberAccessRole,
  canEditMemberTeamRole,
  canRemoveMember,
} from "@/lib/organization-member-service";
import { formatMemberRole } from "@/lib/organization-members-data";
import { getOrganizationMember } from "@/lib/organization-members-storage";
import type { OrganizationMember } from "@/types/organization-profile";
import type { OrganizationMemberProfile } from "@/types/organization-member";

type Props = {
  orgId: string;
  orgName: string;
  memberId: string;
};

export function OrgMemberDetailView({ orgId, orgName, memberId }: Props) {
  const router = useRouter();
  const [member, setMember] = useState<OrganizationMember | null>(null);
  const [profile, setProfile] = useState<OrganizationMemberProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const refresh = useCallback(() => {
    const next = getOrganizationMember(orgId, memberId);
    setMember(next);
    setProfile(next ? getOrganizationMemberProfile(orgId, memberId) : null);
    setReady(true);
  }, [orgId, memberId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const canEdit = useMemo(() => {
    if (!member) return false;
    return (
      canEditMemberTeamRole(orgId, member.id).allowed ||
      canEditMemberAccessRole(orgId, member.id).allowed
    );
  }, [orgId, member]);

  const canRemove = useMemo(() => {
    if (!member) return false;
    return canRemoveMember(orgId, member.id).allowed;
  }, [orgId, member]);

  function handleRemoved() {
    router.push(`/dashboard/organization/${orgId}/members`);
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading member…</p>
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
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-foreground">
            {member.initials}
          </span>
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
            {member.githubUsername ? (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Github className="h-3.5 w-3.5" />
                @{member.githubUsername}
              </p>
            ) : null}
          </div>
        </div>

        {(canEdit || canRemove) && (
          <div className="flex flex-wrap gap-2">
            {canEdit ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit roles
              </Button>
            ) : null}
            {canRemove ? (
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
          </div>
        )}
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
            Team role
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">{member.jobTitle}</p>
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
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground">
            Company intelligence
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Learning progress, skill benchmarks, and growth context within {orgName}.
          </p>
        </div>
        <MemberCompanyIntelligence profile={profile} orgName={orgName} />
      </section>

      <EditMemberRoleDialog
        orgId={orgId}
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={refresh}
      />
      <RemoveMemberDialog
        orgId={orgId}
        orgName={orgName}
        member={member}
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        onRemoved={handleRemoved}
      />
    </div>
  );
}
