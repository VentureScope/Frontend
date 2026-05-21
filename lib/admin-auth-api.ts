import api from "@/lib/api";
import adminApi from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { isAdminDemoEnabled } from "@/lib/admin-utils";
import { useAdminStore } from "@/store/useAdminStore";
import type { LoginSuccessResponse } from "@/types/auth";
import type { AdminUserResponse } from "@/types/admin";
import type {
  AdminSessionData,
  AdminSignInPayload,
} from "@/types/admin-auth";

const DEMO_ADMIN_EMAIL = "admin@venturescope.dev";
const DEMO_ADMIN_PASSWORD = "admin123";

export function isDemoAdminCredentials(
  email: string,
  password: string,
): boolean {
  if (!isAdminDemoEnabled()) {
    return false;
  }
  return (
    email.trim().toLowerCase() === DEMO_ADMIN_EMAIL &&
    password === DEMO_ADMIN_PASSWORD
  );
}

function createDemoAdminSession(): AdminSessionData {
  const demoUser: AdminUserResponse = {
    id: "demo-admin",
    email: DEMO_ADMIN_EMAIL,
    full_name: "Platform Administrator",
    github_username: null,
    career_interest: null,
    skills: null,
    cv_url: null,
    profile_picture_url: null,
    estudent_profile: null,
    social_links: null,
    role: "professional",
    is_active: true,
    is_admin: true,
    has_password: true,
    mfa_enabled: false,
  };

  return {
    token: "demo-admin-session",
    tokenType: "bearer",
    user: demoUser,
  };
}

async function fetchAdminProfile(
  token: string,
  tokenType: string,
): Promise<AdminUserResponse | null> {
  try {
    const response = await adminApi.get<AdminUserResponse>("/api/users/me", {
      headers: { Authorization: `${tokenType} ${token}` },
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function getCurrentAdminProfile(): Promise<AdminUserResponse> {
  const res = await adminApi.get<AdminUserResponse>("/api/users/me");
  return res.data;
}

export async function buildAdminSessionData(
  authResult: LoginSuccessResponse,
): Promise<AdminSessionData> {
  const token = authResult.access_token;
  const tokenType = authResult.token_type ?? "bearer";

  let user: AdminUserResponse | null = null;

  if (authResult.user && authResult.user.id) {
    user = authResult.user as unknown as AdminUserResponse;
  } else {
    user = await fetchAdminProfile(token, tokenType);
  }

  return {
    token,
    tokenType,
    user,
  };
}

export function assertAdminUser(user: AdminUserResponse | null | undefined): void {
  if (!user?.is_admin) {
    throw new Error(
      "This account does not have administrator access.",
    );
  }
}

export async function adminLogin(
  payload: AdminSignInPayload,
): Promise<AdminSessionData> {
  const email = payload.email.trim().toLowerCase();

  if (isDemoAdminCredentials(email, payload.password)) {
    return createDemoAdminSession();
  }

  const response = await api.post<LoginSuccessResponse>("/api/auth/login", {
    email,
    password: payload.password,
  });

  const session = await buildAdminSessionData(response.data);
  assertAdminUser(session.user);

  return session;
}

export async function adminLogout(): Promise<void> {
  const { token } = useAdminStore.getState().authData;
  if (token && token !== "demo-admin-session") {
    try {
      await adminApi.post("/api/auth/logout");
    } catch {
      // Clear local session even if backend logout fails.
    }
  }
}

export { getApiErrorMessage };
