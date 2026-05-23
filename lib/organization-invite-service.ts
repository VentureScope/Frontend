import { getApiErrorMessage } from "@/lib/auth-api";
import { parseOrganizationMembers } from "@/lib/organization-member-parsers";
import {
  listOrganizationMembers,
  sendOrganizationInvite as sendInviteApi,
} from "@/lib/organizations-api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInviteEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export type SendInviteResult =
  | { ok: true; inviteId: string }
  | { ok: false; error: string };

export async function sendOrganizationInviteApi(
  orgId: string,
  email: string,
  teamRole?: string | null,
): Promise<SendInviteResult> {
  const normalized = email.trim().toLowerCase();
  const role = teamRole?.trim() || null;

  if (!normalized) {
    return { ok: false, error: "Email is required." };
  }
  if (!validateInviteEmail(normalized)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  try {
    const members = await listOrganizationMembers(orgId);
    const parsed = parseOrganizationMembers(members);
    if (parsed.some((m) => m.email.toLowerCase() === normalized)) {
      return {
        ok: false,
        error: "This person is already a member of the organization.",
      };
    }

    const invite = await sendInviteApi(orgId, {
      email: normalized,
      team_role: role,
    });
    return { ok: true, inviteId: invite.id };
  } catch (err) {
    return { ok: false, error: getApiErrorMessage(err) };
  }
}
