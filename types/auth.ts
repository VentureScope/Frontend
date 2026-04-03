export type UserRole = "individual" | "corporate";

export interface RegisterPayload {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}
