import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { logoutUser } from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";

type ClientLogoutOptions = {
  /** Where to send the user after clearing local auth. Defaults to `/`. */
  redirectTo?: string;
  router?: AppRouterInstance;
};

/**
 * Sign out without flashing the dashboard "Checking session…" guard.
 * Sets a global logging-out flag, navigates away, clears local auth, then
 * best-effort invalidates the server session.
 */
export async function performClientLogout(
  options: ClientLogoutOptions = {},
): Promise<void> {
  const { redirectTo = "/", router } = options;
  const store = useAppStore.getState();

  if (store.isLoggingOut) {
    return;
  }

  store.setLoggingOut(true);

  if (router) {
    router.replace(redirectTo);
  }

  store.clearAuth();

  try {
    await logoutUser();
  } catch {
    // Local session is already cleared — user can always exit.
  } finally {
    useAppStore.getState().setLoggingOut(false);
  }

  if (
    !router &&
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/dashboard") ||
      window.location.pathname.startsWith("/admin"))
  ) {
    window.location.assign(redirectTo);
  }
}
