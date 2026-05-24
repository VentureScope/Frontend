import type { OrganizationRole } from "@/types/organization";
import type { OrganizationMember } from "@/types/organization-profile";
import { canInviteMembers } from "@/lib/organization-permissions";

export { canInviteMembers };

export function getCurrentMemberFromList(
  members: OrganizationMember[],
): OrganizationMember | null {
  return members.find((m) => m.isCurrentUser) ?? null;
}

export function canRemoveMember(
  myRole: OrganizationRole,
  target: OrganizationMember,
  currentUserId: string,
): { allowed: boolean; reason?: string } {
  if (myRole !== "owner") {
    return {
      allowed: false,
      reason: "Only the organization owner can remove members.",
    };
  }
  if (target.role === "owner") {
    return {
      allowed: false,
      reason: "The organization owner cannot be removed.",
    };
  }
  if (target.id === currentUserId) {
    return {
      allowed: false,
      reason: "You cannot remove yourself from the organization.",
    };
  }
  return { allowed: true };
}

/** Member role editing is not supported by the API yet. */
export function canEditMemberRoles(): { allowed: boolean; reason?: string } {
  return {
    allowed: false,
    reason: "Member roles cannot be changed via the API yet.",
  };
}
