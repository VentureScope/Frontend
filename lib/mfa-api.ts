/**
 * MFA API client functions.
 *
 * All calls hit /api/auth/mfa/* on the FastAPI backend.
 * The Bearer token from the app store is injected automatically by the
 * Axios interceptor in lib/api.ts.
 */

import api from "@/lib/api";
import {
  MFAEnrollResponse,
  MFAEnrollVerifyPayload,
  MFAEnrollVerifyResponse,
  MFAChallengePayload,
  MFAChallengeResponse,
  MFAVerifyPayload,
  MFAVerifyResponse,
  MFAListFactorsResponse,
  MFAUnenrollPayload,
  MFAUnenrollResponse,
  MFASyncResponse,
  MFADisableResponse,
  MFAALResponse,
} from "@/types/mfa";

function log(method: string, path: string, data?: unknown) {
  console.log(`[mfa-api] ${method} ${path}`, data ?? {});
}

// ── Enrollment ──────────────────────────────────────────────────────────────

export async function mfaEnroll(): Promise<MFAEnrollResponse> {
  const path = "/api/auth/mfa/enroll";
  const res = await api.post<MFAEnrollResponse>(path);
  log("POST", path, { factor_id: res.data.factor_id });
  return res.data;
}

export async function mfaEnrollVerify(
  payload: MFAEnrollVerifyPayload,
): Promise<MFAEnrollVerifyResponse> {
  const path = "/api/auth/mfa/enroll/verify";
  const res = await api.post<MFAEnrollVerifyResponse>(path, payload);
  log("POST", path, { verified: res.data.verified });
  return res.data;
}

// ── Challenge / Verify ──────────────────────────────────────────────────────

export async function mfaChallenge(
  payload: MFAChallengePayload,
): Promise<MFAChallengeResponse> {
  const path = "/api/auth/mfa/challenge";
  const res = await api.post<MFAChallengeResponse>(path, payload);
  log("POST", path);
  return res.data;
}

export async function mfaVerify(
  payload: MFAVerifyPayload,
): Promise<MFAVerifyResponse> {
  const path = "/api/auth/mfa/verify";
  const res = await api.post<MFAVerifyResponse>(path, payload);
  log("POST", path, { aal: res.data.aal });
  return res.data;
}

// ── Factors ─────────────────────────────────────────────────────────────────

export async function mfaListFactors(): Promise<MFAListFactorsResponse> {
  const path = "/api/auth/mfa/factors";
  const res = await api.get<MFAListFactorsResponse>(path);
  log("GET", path, { count: res.data.factors.length });
  return res.data;
}

export async function mfaUnenroll(
  payload: MFAUnenrollPayload,
): Promise<MFAUnenrollResponse> {
  const path = "/api/auth/mfa/unenroll";
  const res = await api.post<MFAUnenrollResponse>(path, payload);
  log("POST", path, { factor_id: payload.factor_id });
  return res.data;
}

// ── Sync / Disable ──────────────────────────────────────────────────────────

export async function mfaSync(): Promise<MFASyncResponse> {
  const path = "/api/auth/mfa/sync";
  const res = await api.post<MFASyncResponse>(path);
  log("POST", path, res.data);
  return res.data;
}

export async function mfaDisable(): Promise<MFADisableResponse> {
  const path = "/api/auth/mfa/disable";
  const res = await api.post<MFADisableResponse>(path);
  log("POST", path, res.data);
  return res.data;
}

// ── AAL status ───────────────────────────────────────────────────────────────

export async function mfaGetAAL(): Promise<MFAALResponse> {
  const path = "/api/auth/mfa/aal";
  const res = await api.get<MFAALResponse>(path);
  log("GET", path, res.data);
  return res.data;
}
