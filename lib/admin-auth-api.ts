import api from "@/lib/api";
import adminApi from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { useAdminStore } from "@/store/useAdminStore";
import type { LoginSuccessResponse } from "@/types/auth";
import type {
  AdminSessionData,
  AdminSignInPayload,
  AdminUser,
} from "@/types/admin-auth";

const DEMO_ADMIN_EMAIL = "admin@venturescope.dev";
const DEMO_ADMIN_PASSWORD = "admin123";

export function isDemoAdminCredentials(
  email: string,
  password: string,
): boolean {
  return (
    email.trim().toLowerCase() === DEMO_ADMIN_EMAIL &&
    password === DEMO_ADMIN_PASSWORD
  );
}

function createDemoAdminSession(): AdminSessionData {
  return {
    token: "demo-admin-session",
    tokenType: "bearer",
    user: {
      id: "demo-admin",
      email: DEMO_ADMIN_EMAIL,
      full_name: "Platform Administrator",
      role: "admin",
      is_admin: true,
    },
  };
}

async function fetchAdminUser(
  token: string,
  tokenType: string,
): Promise<AdminUser | null> {
  try {
    const response = await api.get<AdminUser>("/api/users/me", {
      headers: { Authorization: `${tokenType} ${token}` },
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function buildAdminSessionData(
  authResult: LoginSuccessResponse,
): Promise<AdminSessionData> {
  const token = authResult.access_token;
  const tokenType = authResult.token_type ?? "bearer";

  const user =
    authResult.user ??
    (await fetchAdminUser(token, tokenType)) ??
  null;

  return {
    token,
    tokenType,
    user,
  };
}

export async function adminLogin(
  payload: AdminSignInPayload,
): Promise<AdminSessionData> {
  const email = payload.email.trim().toLowerCase();

  if (isDemoAdminCredentials(email, payload.password)) {
    return createDemoAdminSession();
  }

  try {
    const response = await api.post<LoginSuccessResponse>("/api/auth/login", {
      email,
      password: payload.password,
    });

    const session = await buildAdminSessionData(response.data);

    if (!session.user?.is_admin) {
      throw new Error(
        "This account does not have administrator access. Use an admin account or demo credentials.",
      );
    }

    return session;
  } catch (error) {
    if (isDemoAdminCredentials(email, payload.password)) {
      return createDemoAdminSession();
    }
    throw error;
  }
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
