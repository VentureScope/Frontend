import type { OrganizationRole } from "@/types/organization";

export function parseOrganizationRole(role: string | undefined): OrganizationRole {
  if (role === "owner" || role === "admin" || role === "member") {
    return role;
  }
  return "member";
}

export function canManageOrganization(role: OrganizationRole): boolean {
  return role === "owner" || role === "admin";
}

export function canInviteMembers(role: OrganizationRole): boolean {
  return role === "owner";
}

export function canDeleteOrganization(role: OrganizationRole): boolean {
  return role === "owner";
}

/** `PATCH /api/organizations/{id}` and logo upload are owner-only per API. */
export function canEditOrganizationProfile(role: OrganizationRole): boolean {
  return role === "owner";
}

export function canAssignRoadmaps(role: OrganizationRole): boolean {
  return role === "owner";
}
