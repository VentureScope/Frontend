export type UserRole = "professional";

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  career_interest: string;
  role: UserRole;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface RegisterSuccessResponse {
  id: string;
  email: string;
  full_name: string;
  github_username: string;
  career_interest: string;
  role: string;
}

export interface UserUpdatePayload {
  full_name?: string | null;
  github_username?: string | null;
  career_interest?: string | null;
  estudent_profile?: string | null;
}

export interface PasswordChangePayload {
  current_password?: string;
  new_password?: string;
}

export interface DeleteAccountPayload {
  password?: string;
}

export interface UserSkillsPayload {
  skills: string[];
}

export interface AuthUser {
  id?: string;
  email?: string;
  full_name?: string;
  github_username?: string | null;
  career_interest?: string | null;
  skills?: string[] | null;
  role?: string;
  is_active?: boolean;
  is_admin?: boolean;
  [key: string]: unknown;
}

export interface LoginSuccessResponse {
  access_token: string;
  token_type: "bearer" | string;
  user?: AuthUser;
}

export interface AuthSessionData {
  token: string | null;
  tokenType: string | null;
  user: AuthUser | null;
}

export interface GoogleOAuthLoginResponse {
  authorization_url: string;
  state: string;
}

export interface GithubOAuthLoginResponse {
  authorization_url: string;
  state: string;
}
