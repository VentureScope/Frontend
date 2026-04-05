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

export interface LoginSuccessResponse {
  access_token: string;
  token_type: "bearer" | string;
}
