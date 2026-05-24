import { RETURN_PATH_PARAM } from "@/lib/auth-redirect";

/** Encode password for short-lived verify-email query param (not for storage). */
export function encodePasswordForQuery(password: string): string {
  return btoa(encodeURIComponent(password));
}

export function decodePasswordFromQuery(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch {
    try {
      return atob(encoded);
    } catch {
      return "";
    }
  }
}

export function buildVerifyEmailUrl(
  email: string,
  password?: string,
  returnPath?: string | null,
): string {
  const params = new URLSearchParams({ email });
  if (password) {
    try {
      params.set("p", encodePasswordForQuery(password));
    } catch {
      // Omit password — user can sign in manually after OTP.
    }
  }
  if (returnPath) {
    params.set(RETURN_PATH_PARAM, returnPath);
  }
  return `/verify-email?${params.toString()}`;
}
