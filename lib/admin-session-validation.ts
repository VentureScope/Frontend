const ADMIN_ME_REVALIDATE_KEY = "admin-me-revalidated";

/** One background /me check per browser tab session after a trusted login. */
export function hasAdminMeBeenRevalidated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_ME_REVALIDATE_KEY) === "1";
}

export function markAdminMeRevalidated(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_ME_REVALIDATE_KEY, "1");
}

export function clearAdminMeRevalidated(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_ME_REVALIDATE_KEY);
}
