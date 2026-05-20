import { getApiErrorMessage } from "@/lib/auth-api";
import type { AdminUserResponse, AdminUserRole } from "@/types/admin";

export { getApiErrorMessage as getAdminApiErrorMessage };

export function isAdminDemoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADMIN_DEMO_LOGIN === "true";
}

export function formatAdminRoleLabel(
  role: string | undefined,
  isAdmin?: boolean,
): string {
  if (isAdmin) {
    return "Admin";
  }
  switch (role) {
    case "student":
      return "Student";
    case "professional":
      return "Professional";
    case "b2b_client":
      return "B2B Client";
    default:
      return role?.replace(/_/g, " ") ?? "—";
  }
}

export function roleBadgeValue(user: AdminUserResponse): string {
  return formatAdminRoleLabel(user.role, user.is_admin);
}

export function displayUserName(user: AdminUserResponse): string {
  return user.full_name?.trim() || user.email.split("@")[0] || "Unknown";
}

export function isAdminRole(user: AdminUserResponse): boolean {
  return Boolean(user.is_admin);
}

export function matchesDirectoryTab(
  user: AdminUserResponse,
  tab: DirectoryTabId,
): boolean {
  switch (tab) {
    case "all":
      return true;
    case "admins":
      return user.is_admin;
    case "inactive":
      return !user.is_active;
    case "student":
    case "professional":
    case "b2b_client":
      return !user.is_admin && user.role === tab;
    default:
      return true;
  }
}

export type DirectoryTabId =
  | "all"
  | "student"
  | "professional"
  | "b2b_client"
  | "admins"
  | "inactive";

export const DIRECTORY_TABS: { id: DirectoryTabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "student", label: "Students" },
  { id: "professional", label: "Professionals" },
  { id: "b2b_client", label: "B2B Clients" },
  { id: "admins", label: "Admins" },
  { id: "inactive", label: "Inactive" },
];

export function parseAdminRole(value: string): AdminUserRole | null {
  if (value === "student" || value === "professional" || value === "b2b_client") {
    return value;
  }
  return null;
}
