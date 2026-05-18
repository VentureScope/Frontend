import { CORE_SERVICE_OPTIONS } from "@/lib/organization-create-constants";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";
import {
  addPendingInvite,
  hasPendingInviteForOrgEmail,
} from "@/lib/organization-invites-storage";
import { getOrganizationMembers } from "@/lib/organization-members-data";
import { getOrganizationProfile } from "@/lib/organization-profiles-storage";
import {
  addSentInvite,
  hasPendingSentInvite,
} from "@/lib/organization-sent-invites-storage";
import type { OrganizationAccessRole } from "@/types/organization-invite";
import type { OrganizationInvite } from "@/types/organization-invite";
import type { SentOrganizationInvite } from "@/types/organization-sent-invite";
import { canManageMembers } from "@/lib/organization-member-service";

export type SendOrganizationInviteInput = {
  orgId: string;
  inviteeEmail: string;
  teamRole: string;
  accessRole: OrganizationAccessRole;
  invitedBy: string;
  invitedByEmail: string;
};

export type SendInviteResult =
  | { ok: true; inviteId: string }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInviteEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export const canInviteMembers = canManageMembers;

function memberExists(orgId: string, email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return getOrganizationMembers(orgId).some(
    (m) => m.email.toLowerCase() === normalized,
  );
}

function buildInvitePayload(
  input: SendOrganizationInviteInput,
): OrganizationInvite {
  const orgList = MOCK_ORGANIZATIONS.find((o) => o.id === input.orgId);
  const profile = getOrganizationProfile(input.orgId);
  const orgName =
    profile?.displayName ?? orgList?.name ?? input.orgId.replace(/-/g, " ");

  const id = `inv-${input.orgId}-${Date.now()}`;
  const sentAt = new Date().toISOString().slice(0, 10);

  const fromProfile = [
    ...(profile?.coreServices ?? []).map(
      (id) =>
        CORE_SERVICE_OPTIONS.find((o) => o.id === id)?.title ??
        id.replace(/-/g, " "),
    ),
    ...(profile?.customServices ?? []),
  ].filter(Boolean);
  const coreServices =
    fromProfile.length > 0
      ? fromProfile.slice(0, 6)
      : ["Engineering", "Product", "Operations"];

  return {
    id,
    orgId: input.orgId,
    organizationName: orgName,
    inviteeEmail: input.inviteeEmail.trim().toLowerCase(),
    invitedBy: input.invitedBy,
    invitedByEmail: input.invitedByEmail,
    teamRole: input.teamRole,
    accessRole: input.accessRole,
    sentAt,
    memberCount: orgList?.memberCount ?? 0,
    activeProjects: orgList?.activeProjects ?? 0,
    industry: profile?.industryVertical ?? "Technology & Software",
    tagline: profile?.tagline ?? "",
    description:
      profile?.description ??
      `${orgName} has invited you to join their organization on VentureScope.`,
    location: profile?.headquarters || "—",
    website: profile?.website || undefined,
    memberAvatars: orgList?.memberAvatars ?? [{ initials: "TM" }],
    extraMemberCount: orgList?.extraMemberCount,
    coreServices,
  };
}

export function sendOrganizationInvite(
  input: SendOrganizationInviteInput,
): SendInviteResult {
  const email = input.inviteeEmail.trim().toLowerCase();

  if (!email) {
    return { ok: false, error: "Email is required." };
  }
  if (!validateInviteEmail(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!input.teamRole.trim()) {
    return { ok: false, error: "Select a team role." };
  }
  if (!canManageMembers(input.orgId)) {
    return {
      ok: false,
      error: "Only organization owners and admins can send invitations.",
    };
  }
  if (memberExists(input.orgId, email)) {
    return {
      ok: false,
      error: "This person is already a member of the organization.",
    };
  }
  if (
    hasPendingInviteForOrgEmail(input.orgId, email) ||
    hasPendingSentInvite(input.orgId, email)
  ) {
    return {
      ok: false,
      error: "An invitation is already pending for this email.",
    };
  }

  const invite = buildInvitePayload({ ...input, inviteeEmail: email });
  addPendingInvite(invite);

  const sent: SentOrganizationInvite = {
    id: invite.id,
    orgId: input.orgId,
    inviteeEmail: email,
    teamRole: input.teamRole,
    accessRole: input.accessRole,
    sentAt: invite.sentAt,
    status: "pending",
  };
  addSentInvite(sent);

  return { ok: true, inviteId: invite.id };
}
