import {
  getOrganizationMember,
  loadOrganizationMembers,
} from "@/lib/organization-members-storage";
import type { OrganizationMember } from "@/types/organization-profile";
import type { OrganizationRole } from "@/types/organization";

export function getCurrentMember(orgId: string): OrganizationMember | null {
  return (
    loadOrganizationMembers(orgId).find((m) => m.isCurrentUser) ?? null
  );
}

export function canManageMembers(orgId: string): boolean {
  const current = getCurrentMember(orgId);
  return current?.role === "owner" || current?.role === "admin";
}

/** Only organization owners can remove members. */
export function canRemoveMember(
  orgId: string,
  targetMemberId: string,
): { allowed: boolean; reason?: string } {
  const current = getCurrentMember(orgId);
  if (current?.role !== "owner") {
    return { allowed: false, reason: "Only the organization owner can remove members." };
  }

  const target = getOrganizationMember(orgId, targetMemberId);
  if (!target) {
    return { allowed: false, reason: "Member not found." };
  }
  if (target.role === "owner") {
    return { allowed: false, reason: "The organization owner cannot be removed." };
  }
  if (target.isCurrentUser) {
    return { allowed: false, reason: "You cannot remove yourself from the organization." };
  }

  const owners = loadOrganizationMembers(orgId).filter((m) => m.role === "owner");
  if (target.role === "admin" && owners.length === 0) {
    return { allowed: false, reason: "Cannot remove this member." };
  }

  return { allowed: true };
}

export function canEditMemberTeamRole(
  orgId: string,
  targetMemberId: string,
): { allowed: boolean; reason?: string } {
  if (!canManageMembers(orgId)) {
    return {
      allowed: false,
      reason: "Only owners and admins can change team roles.",
    };
  }

  const current = getCurrentMember(orgId);
  const target = getOrganizationMember(orgId, targetMemberId);
  if (!target) {
    return { allowed: false, reason: "Member not found." };
  }

  if (target.role === "owner" && current?.role !== "owner") {
    return {
      allowed: false,
      reason: "Only the owner can change the owner's team role.",
    };
  }

  return { allowed: true };
}

export function canEditMemberAccessRole(
  orgId: string,
  targetMemberId: string,
): { allowed: boolean; reason?: string } {
  const current = getCurrentMember(orgId);
  if (current?.role !== "owner") {
    return {
      allowed: false,
      reason: "Only the organization owner can change access levels.",
    };
  }

  const target = getOrganizationMember(orgId, targetMemberId);
  if (!target) {
    return { allowed: false, reason: "Member not found." };
  }
  if (target.role === "owner") {
    return { allowed: false, reason: "Owner access cannot be changed." };
  }
  if (target.isCurrentUser) {
    return { allowed: false, reason: "You cannot change your own access level here." };
  }

  return { allowed: true };
}

export function accessRoleOptionsFor(
  target: OrganizationMember,
): OrganizationRole[] {
  if (target.role === "owner") return ["owner"];
  return ["member", "admin"];
}
