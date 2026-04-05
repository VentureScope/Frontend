import { AxiosError } from "axios";

import api from "@/lib/api";
import {
  GoogleOAuthLoginResponse,
  LoginSuccessResponse,
  RegisterPayload,
  RegisterSuccessResponse,
  SignInPayload,
} from "@/types/auth";

interface ApiErrorBody {
  message?: string;
  detail?: string;
  error?: string;
}

const GOOGLE_OAUTH_LOGIN_PATH = "/api/auth/oauth/google/login";
const GOOGLE_OAUTH_CALLBACK_PATH = "/api/auth/oauth/google/callback";

function logRequestSuccess(
  method: string,
  path: string,
  details?: unknown,
): void {
  console.log(`[auth-api] ${method} ${path} success`, details ?? {});
}

function logRequestError(method: string, path: string, error: unknown): void {
  console.log(`[auth-api] ${method} ${path} error`, {
    message: getApiErrorMessage(error),
    raw: error,
  });
}

function validateGoogleAuthorizationUrl(
  authorizationUrl: string,
  expectedState: string,
): void {
  const parsed = new URL(authorizationUrl);
  const clientId = parsed.searchParams.get("client_id");
  const state = parsed.searchParams.get("state");
  const redirectUri = parsed.searchParams.get("redirect_uri");
  const responseType = parsed.searchParams.get("response_type");
  const scope = parsed.searchParams.get("scope");

  if (!clientId) {
    throw new Error("Google authorization URL is missing client_id.");
  }

  if (!redirectUri) {
    throw new Error("Google authorization URL is missing redirect_uri.");
  }

  if (!responseType || responseType.toLowerCase() !== "code") {
    throw new Error("Google authorization URL is missing response_type=code.");
  }

  if (!scope) {
    throw new Error("Google authorization URL is missing scope.");
  }

  if (!state || state !== expectedState) {
    throw new Error("Google authorization state mismatch.");
  }
}

function getMessage(source: unknown): string | null {
  if (!source || typeof source !== "object") {
    return null;
  }

  const record = source as ApiErrorBody;
  return record.message || record.detail || record.error || null;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      getMessage(error.response?.data) ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message || "Something went wrong. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong. Please try again.";
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterSuccessResponse> {
  const path = "/api/auth/register";
  try {
    const response = await api.post<RegisterSuccessResponse>(path, payload);
    logRequestSuccess("POST", path, { status: response.status });
    return response.data;
  } catch (error) {
    logRequestError("POST", path, error);
    throw error;
  }
}

export async function loginUser(
  payload: SignInPayload,
): Promise<LoginSuccessResponse> {
  const path = "/api/auth/login";
  try {
    const response = await api.post<LoginSuccessResponse>(path, payload);
    logRequestSuccess("POST", path, { status: response.status });
    return response.data;
  } catch (error) {
    logRequestError("POST", path, error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  const path = "/api/auth/logout";
  try {
    const response = await api.post(path);
    logRequestSuccess("POST", path, { status: response.status });
  } catch (error) {
    logRequestError("POST", path, error);
    throw error;
  }
}

function normalizeOAuthCallbackResponse(
  data: string | LoginSuccessResponse,
): LoginSuccessResponse {
  if (typeof data === "string") {
    return {
      access_token: data,
      token_type: "bearer",
    };
  }

  return data;
}

export async function getGoogleOAuthLoginUrl(): Promise<GoogleOAuthLoginResponse> {
  try {
    const response = await api.get<GoogleOAuthLoginResponse>(
      GOOGLE_OAUTH_LOGIN_PATH,
    );

    validateGoogleAuthorizationUrl(
      response.data.authorization_url,
      response.data.state,
    );

    logRequestSuccess("GET", GOOGLE_OAUTH_LOGIN_PATH, {
      status: response.status,
      state: response.data.state,
      authorizationHost: new URL(response.data.authorization_url).host,
    });

    return response.data;
  } catch (error) {
    logRequestError("GET", GOOGLE_OAUTH_LOGIN_PATH, error);
    throw error;
  }
}

export async function completeGoogleOAuthCallback(
  code: string,
  state: string,
): Promise<LoginSuccessResponse> {
  try {
    const response = await api.post<string | LoginSuccessResponse>(
      GOOGLE_OAUTH_CALLBACK_PATH,
      {
        code,
        state,
      },
    );

    const normalized = normalizeOAuthCallbackResponse(response.data);
    logRequestSuccess("POST", GOOGLE_OAUTH_CALLBACK_PATH, {
      status: response.status,
      tokenType: normalized.token_type,
    });

    return normalized;
  } catch (error) {
    logRequestError("POST", GOOGLE_OAUTH_CALLBACK_PATH, error);
    throw error;
  }
}
