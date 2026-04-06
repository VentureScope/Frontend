import { AxiosError } from "axios";

import api from "@/lib/api";
import {
  AuthSessionData,
  AuthUser,
  GithubOAuthLoginResponse,
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
const GITHUB_OAUTH_LOGIN_PATH = "/api/auth/oauth/github/login";
const GITHUB_OAUTH_CALLBACK_PATH = "/api/auth/oauth/github/callback";

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

function validateOAuthAuthorizationUrl(
  authorizationUrl: string,
  expectedState: string,
  options?: {
    requireRedirectUri?: boolean;
    requireCodeResponseType?: boolean;
    requireScope?: boolean;
  },
): void {
  const parsed = new URL(authorizationUrl);
  const clientId = parsed.searchParams.get("client_id");
  const state = parsed.searchParams.get("state");
  const redirectUri = parsed.searchParams.get("redirect_uri");
  const responseType = parsed.searchParams.get("response_type");
  const scope = parsed.searchParams.get("scope");
  const {
    requireRedirectUri = true,
    requireCodeResponseType = true,
    requireScope = true,
  } = options ?? {};

  if (!clientId) {
    throw new Error("Google authorization URL is missing client_id.");
  }

  if (requireRedirectUri && !redirectUri) {
    throw new Error("Google authorization URL is missing redirect_uri.");
  }

  if (
    requireCodeResponseType &&
    (!responseType || responseType.toLowerCase() !== "code")
  ) {
    throw new Error("Google authorization URL is missing response_type=code.");
  }

  if (requireScope && !scope) {
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

    validateOAuthAuthorizationUrl(
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

export async function getGithubOAuthLoginUrl(): Promise<GithubOAuthLoginResponse> {
  try {
    const response = await api.get<GithubOAuthLoginResponse>(
      GITHUB_OAUTH_LOGIN_PATH,
    );

    validateOAuthAuthorizationUrl(
      response.data.authorization_url,
      response.data.state,
      {
        requireRedirectUri: false,
        requireCodeResponseType: false,
        requireScope: false,
      },
    );

    logRequestSuccess("GET", GITHUB_OAUTH_LOGIN_PATH, {
      status: response.status,
      state: response.data.state,
      authorizationHost: new URL(response.data.authorization_url).host,
    });

    return response.data;
  } catch (error) {
    logRequestError("GET", GITHUB_OAUTH_LOGIN_PATH, error);
    throw error;
  }
}

async function completeGithubOAuthCallbackByPost(
  code: string,
  state: string,
): Promise<LoginSuccessResponse> {
  const response = await api.post<string | LoginSuccessResponse>(
    GITHUB_OAUTH_CALLBACK_PATH,
    {
      code,
      state,
    },
  );

  const normalized = normalizeOAuthCallbackResponse(response.data);
  logRequestSuccess("POST", GITHUB_OAUTH_CALLBACK_PATH, {
    status: response.status,
    tokenType: normalized.token_type,
  });

  return normalized;
}

async function completeGithubOAuthCallbackByGet(
  code: string,
  state: string,
): Promise<LoginSuccessResponse> {
  const response = await api.get<string | LoginSuccessResponse>(
    GITHUB_OAUTH_CALLBACK_PATH,
    {
      params: {
        code,
        state,
      },
    },
  );

  const normalized = normalizeOAuthCallbackResponse(response.data);
  logRequestSuccess("GET", GITHUB_OAUTH_CALLBACK_PATH, {
    status: response.status,
    tokenType: normalized.token_type,
  });

  return normalized;
}

export async function completeGithubOAuthCallback(
  code: string,
  state: string,
): Promise<LoginSuccessResponse> {
  try {
    return await completeGithubOAuthCallbackByPost(code, state);
  } catch (postError) {
    const shouldFallbackToGet =
      postError instanceof AxiosError &&
      (postError.response?.status === 404 ||
        postError.response?.status === 405 ||
        postError.response?.status === 422);

    if (!shouldFallbackToGet) {
      logRequestError("POST", GITHUB_OAUTH_CALLBACK_PATH, postError);
      throw postError;
    }

    logRequestError("POST", GITHUB_OAUTH_CALLBACK_PATH, postError);
    return await completeGithubOAuthCallbackByGet(code, state);
  }
}

export async function getCurrentUser(
  accessToken: string,
  tokenType: string = "bearer",
): Promise<AuthUser> {
  const path = "/api/users/me";
  const normalizedTokenType =
    tokenType.toLowerCase() === "bearer" ? "Bearer" : tokenType;

  try {
    const response = await api.get<AuthUser>(path, {
      headers: {
        Authorization: `${normalizedTokenType} ${accessToken}`,
      },
    });
    logRequestSuccess("GET", path, { status: response.status });
    return response.data;
  } catch (error) {
    logRequestError("GET", path, error);
    throw error;
  }
}

export async function buildAuthSessionData(
  authResult: LoginSuccessResponse,
): Promise<AuthSessionData> {
  const user = await getCurrentUser(
    authResult.access_token,
    authResult.token_type,
  );

  return {
    token: authResult.access_token,
    tokenType: authResult.token_type,
    user,
  };
}
