import type { OrganizationRole } from "@/types/organization";

export function formatMemberRole(role: OrganizationRole): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    default:
      return "Member";
  }
}
