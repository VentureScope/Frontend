import { loadOrganizationMembers } from "@/lib/organization-members-storage";
import type { OrganizationMember } from "@/types/organization-profile";

export function getOrganizationMembers(orgId: string): OrganizationMember[] {
  return loadOrganizationMembers(orgId);
}

export function formatMemberRole(role: OrganizationMember["role"]): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    default:
      return "Member";
  }
}
