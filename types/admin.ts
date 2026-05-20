/** Admin API types aligned with OpenAPI (`api.json`). */

export type AdminUserRole = "student" | "professional" | "b2b_client";

export interface AdminUserResponse {
  id: string;
  email: string;
  full_name: string | null;
  github_username: string | null;
  career_interest: string | null;
  skills: string[] | null;
  cv_url: string | null;
  profile_picture_url: string | null;
  estudent_profile: string | null;
  social_links: Record<string, unknown> | null;
  role: string;
  is_active: boolean;
  is_admin: boolean;
  oauth_provider?: string | null;
  mfa_enabled?: boolean;
  mfa_enrolled_at?: string | null;
  has_password?: boolean;
}

export interface AdminUserListResponse {
  items: AdminUserResponse[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface AdminUserUpdatePayload {
  full_name?: string | null;
  github_username?: string | null;
  career_interest?: string | null;
  skills?: string[] | null;
  cv_url?: string | null;
  estudent_profile?: string | null;
  role?: AdminUserRole | null;
  is_active?: boolean | null;
  is_admin?: boolean | null;
}

export interface AdminMessageResponse {
  message: string;
}

export type ListAdminUsersParams = {
  page?: number;
  per_page?: number;
  include_inactive?: boolean;
};

export type DeleteAdminUserParams = {
  hard_delete?: boolean;
};
