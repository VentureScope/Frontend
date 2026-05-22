import { parseOrganizationRole } from "@/lib/organization-permissions";
import type { OrgInviteOutApi, OrgMemberOutApi } from "@/types/organization-api";
import type { OrganizationMember } from "@/types/organization-profile";
import type { SentOrganizationInvite } from "@/types/organization-sent-invite";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "??";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function parseOrgMemberOutApi(raw: unknown): OrgMemberOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const user_id = asString(row.user_id);
  const email = asString(row.email);
  const role = asString(row.role);
  const joined_at = asString(row.joined_at);

  if (!user_id || !email || !role || !joined_at) return null;

  return {
    user_id,
    email,
    role,
    joined_at,
    full_name:
      row.full_name === null || typeof row.full_name === "string"
        ? (row.full_name as string | null)
        : undefined,
    profile_picture_url:
      row.profile_picture_url === null ||
      typeof row.profile_picture_url === "string"
        ? (row.profile_picture_url as string | null)
        : undefined,
    skills: Array.isArray(row.skills)
      ? row.skills.map((s) => asString(s)).filter(Boolean)
      : null,
    career_interest:
      row.career_interest === null || typeof row.career_interest === "string"
        ? (row.career_interest as string | null)
        : undefined,
  };
}

export function toOrganizationMember(
  api: OrgMemberOutApi,
  currentUserId?: string | null,
  currentUserEmail?: string | null,
): OrganizationMember {
  const name =
    api.full_name?.trim() ||
    api.email.split("@")[0]?.replace(/[._]/g, " ") ||
    "Member";
  const parsedRole = parseOrganizationRole(api.role);

  return {
    id: api.user_id,
    name,
    email: api.email,
    role: parsedRole,
    jobTitle:
      api.career_interest?.trim() ||
      (parsedRole === "owner"
        ? "Organization owner"
        : parsedRole === "admin"
          ? "Administrator"
          : "Team member"),
    initials: initialsFromName(name),
    joinedAt: api.joined_at,
    skills: api.skills ?? [],
    profilePictureUrl: api.profile_picture_url ?? null,
    isCurrentUser: Boolean(
      (currentUserId && api.user_id === currentUserId) ||
        (currentUserEmail &&
          api.email.toLowerCase() === currentUserEmail.toLowerCase()),
    ),
  };
}

export function parseOrganizationMembers(
  raw: unknown,
  currentUserId?: string | null,
  currentUserEmail?: string | null,
): OrganizationMember[] {
  if (!Array.isArray(raw)) return [];
  const members: OrganizationMember[] = [];
  for (const entry of raw) {
    const parsed = parseOrgMemberOutApi(entry);
    if (parsed) {
      members.push(
        toOrganizationMember(parsed, currentUserId, currentUserEmail),
      );
    }
  }
  return members.sort((a, b) => {
    const order = { owner: 0, admin: 1, member: 2 };
    const diff = order[a.role] - order[b.role];
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });
}

export function parseOrgInviteOutApi(raw: unknown): OrgInviteOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const organization_id = asString(row.organization_id);
  const email = asString(row.email);
  const status = asString(row.status);
  const expires_at = asString(row.expires_at);
  const created_at = asString(row.created_at);

  if (!id || !organization_id || !email || !status || !expires_at || !created_at) {
    return null;
  }

  return {
    id,
    organization_id,
    email,
    status,
    expires_at,
    created_at,
  };
}

export function toSentOrganizationInvite(
  api: OrgInviteOutApi,
  orgId: string,
): SentOrganizationInvite {
  return {
    id: api.id,
    orgId,
    inviteeEmail: api.email,
    sentAt: api.created_at,
    status: api.status,
    expiresAt: api.expires_at,
  };
}

export function parseOrganizationInvites(
  raw: unknown,
  orgId: string,
): SentOrganizationInvite[] {
  if (!Array.isArray(raw)) return [];
  const invites: SentOrganizationInvite[] = [];
  for (const entry of raw) {
    const parsed = parseOrgInviteOutApi(entry);
    if (parsed) {
      invites.push(toSentOrganizationInvite(parsed, orgId));
    }
  }
  return invites.filter((inv) => inv.status === "pending");
}
