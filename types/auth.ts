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

export interface AuthUser {
  id?: string;
  email?: string;
  full_name?: string;
  github_username?: string | null;
  career_interest?: string | null;
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

export interface GoogleOAuthLoginResponse {
  authorization_url: string;
  state: string;
}
