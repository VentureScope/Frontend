import { AxiosError } from "axios";

import api from "@/lib/api";
import {
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

  return "Something went wrong. Please try again.";
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterSuccessResponse> {
  const response = await api.post<RegisterSuccessResponse>(
    "/api/auth/register",
    payload,
  );
  return response.data;
}

export async function loginUser(
  payload: SignInPayload,
): Promise<LoginSuccessResponse> {
  const response = await api.post<LoginSuccessResponse>(
    "/api/auth/login",
    payload,
  );
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/api/auth/logout");
}
