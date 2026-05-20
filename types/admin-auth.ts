import type { AdminUserResponse } from "@/types/admin";

/** Session user — same shape as admin user API response. */
export type AdminUser = AdminUserResponse;

export interface AdminSignInPayload {
  email: string;
  password: string;
}

export interface AdminSessionData {
  token: string | null;
  tokenType: string | null;
  user: AdminUser | null;
}
