export type AccountRole = "student" | "professional";

export const ACCOUNT_ROLE_OPTIONS: {
  value: AccountRole;
  label: string;
  description: string;
}[] = [
  {
    value: "professional",
    label: "Professional",
    description: "Working or job-seeking in tech",
  },
  {
    value: "student",
    label: "Student",
    description: "Studying or early in your career",
  },
];

/** @deprecated Use {@link AccountRole} */
export type UserRole = AccountRole;

export interface RegisterPayload {
  email: string;
  password: string;
  role: AccountRole;
  full_name: string;
  github_username?: string | null;
  career_interest: string;
  skills?: string[] | null;
}

export interface SignInPayload {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterSuccessResponse {
  id: string;
  email: string;
  full_name: string | null;
  github_username: string | null;
  career_interest: string | null;
  skills: string[] | null;
  cv_url: string | null;
  profile_picture_url: string | null;
  estudent_profile: string | null;
  social_links: unknown | null;
  role: AccountRole | string;
  is_active: boolean;
  is_admin: boolean;
  oauth_provider: string | null;
  mfa_enabled: boolean;
  mfa_enrolled_at: string | null;
  deactivated_at: string | null;
  has_password: boolean;
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

export interface Experience {
  id: string;
  job_title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
  skills_used: string[];
  created_at?: string;
}

export interface ExperiencePayload {
  job_title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
  skills_used: string[];
}

export interface AuthUser {
  id?: string;
  email?: string;
  full_name?: string;
  github_username?: string | null;
  career_interest?: string | null;
  skills?: string[] | null;
  experiences?: Experience[] | null;
  role?: string;
  is_active?: boolean;
  is_admin?: boolean;
  profile_picture_url?: string | null;
  has_password?: boolean;
  oauth_provider?: string | null;
  mfa_enabled?: boolean;
  mfa_enrolled_at?: string | null;
  /** Server-side onboarding flag when available (preferred over local heuristics). */
  onboarding_completed?: boolean;
  [key: string]: unknown;
}

export interface LoginSuccessResponse {
  access_token: string;
  token_type: "bearer" | string;
  user?: AuthUser;
  /** When true, backend created the account during this OAuth exchange. */
  is_new_user?: boolean;
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

// OTP verification types
export interface OtpVerifyPayload {
  email: string;
  otp: string;
}

export interface OtpVerifyResponse {
  message: string;
}

export interface OtpResendPayload {
  email: string;
}

export interface OtpResendResponse {
  message: string;
}

// Password reset types
export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}
