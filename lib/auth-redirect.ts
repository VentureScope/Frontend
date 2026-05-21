/** Query param used when redirecting unauthenticated users to sign-in. */
export const RETURN_PATH_PARAM = "return-path";

/** Legacy MFA param — still read for backwards compatibility. */
const LEGACY_REDIRECT_PARAM = "redirect";

const BLOCKED_PATH_PREFIXES = [
  "/sign-in",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/mfa-challenge",
  "/mfa-enroll",
  "/oauth",
  "/admin/sign-in",
] as const;

export const DEFAULT_MEMBER_PATH = "/dashboard";
export const DEFAULT_ADMIN_PATH = "/admin";

type SearchParamsLike = {
  get: (key: string) => string | null;
} | null | undefined;

export function isSafeReturnPath(
  path: string | null | undefined,
): path is string {
  if (!path || typeof path !== "string") return false;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("//")) return false;
  if (trimmed.includes("://")) return false;

  const pathOnly = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;
  const lower = pathOnly.toLowerCase();
  for (const blocked of BLOCKED_PATH_PREFIXES) {
    if (lower === blocked || lower.startsWith(`${blocked}/`)) return false;
  }
  return true;
}

export function isSafeAdminReturnPath(
  path: string | null | undefined,
): path is string {
  return isSafeReturnPath(path) && path.startsWith("/admin");
}

/** Current browser location (pathname + search), for client-side guards. */
export function getClientReturnPath(): string {
  if (typeof window === "undefined") return DEFAULT_MEMBER_PATH;
  return `${window.location.pathname}${window.location.search}`;
}

export function buildSignInUrl(returnPath?: string | null): string {
  if (!returnPath || !isSafeReturnPath(returnPath)) {
    return "/sign-in";
  }
  const params = new URLSearchParams({ [RETURN_PATH_PARAM]: returnPath });
  return `/sign-in?${params.toString()}`;
}

export function buildAdminSignInUrl(returnPath?: string | null): string {
  if (!returnPath || !isSafeAdminReturnPath(returnPath)) {
    return "/admin/sign-in";
  }
  const params = new URLSearchParams({ [RETURN_PATH_PARAM]: returnPath });
  return `/admin/sign-in?${params.toString()}`;
}

export function buildMfaChallengeUrl(returnPath: string): string {
  const safe = isSafeReturnPath(returnPath) ? returnPath : DEFAULT_MEMBER_PATH;
  const params = new URLSearchParams({ [RETURN_PATH_PARAM]: safe });
  return `/mfa-challenge?${params.toString()}`;
}

export function resolveReturnPath(
  searchParams: SearchParamsLike,
  fallback = DEFAULT_MEMBER_PATH,
): string {
  const candidate =
    searchParams?.get(RETURN_PATH_PARAM) ??
    searchParams?.get(LEGACY_REDIRECT_PARAM);
  if (candidate && isSafeReturnPath(candidate)) {
    return candidate;
  }
  return fallback;
}

export function resolveAdminReturnPath(
  searchParams: SearchParamsLike,
  fallback = DEFAULT_ADMIN_PATH,
): string {
  const candidate =
    searchParams?.get(RETURN_PATH_PARAM) ??
    searchParams?.get(LEGACY_REDIRECT_PARAM);
  if (candidate && isSafeAdminReturnPath(candidate)) {
    return candidate;
  }
  return fallback;
}

/** Member routes that should preserve return-path on session loss. */
export function isProtectedMemberPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

export function isProtectedAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/sign-in");
}
