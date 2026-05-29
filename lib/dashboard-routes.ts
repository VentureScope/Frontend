/** True for `/dashboard` overview (not nested dashboard routes). */
export function isDashboardHomePath(pathname: string | null): boolean {
  return pathname === "/dashboard" || pathname === "/dashboard/";
}

/** True for any route under the dashboard layout. */
export function isDashboardPath(pathname: string | null): boolean {
  return Boolean(pathname?.startsWith("/dashboard"));
}
