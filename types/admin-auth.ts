export interface AdminUser {
  id?: string;
  email?: string;
  full_name?: string;
  role?: string;
  is_admin?: boolean;
  profile_picture_url?: string | null;
}

export interface AdminSignInPayload {
  email: string;
  password: string;
}

export interface AdminSessionData {
  token: string | null;
  tokenType: string | null;
  user: AdminUser | null;
}
