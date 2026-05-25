const LABELS: Record<string, string> = {
  admin: "Overview",
  directory: "User Directory",
  permissions: "Permissions",
  transcripts: "Transcripts",
  "ml-runs": "ML-Runs",
  embeddings: "ML-Runs",
  "github-syncs": "GitHub Syncs",
  alerts: "System Alerts",
  system: "Technical Health",
  storage: "Storage",
  config: "System Config",
};

/** Client-only: pass `window.location.hash` when on /admin/system. */
export function getAdminBreadcrumb(
  pathname: string,
  hash = "",
): string {
  if (pathname === "/admin") return LABELS.admin;
  if (pathname === "/admin/system" || pathname.startsWith("/admin/system")) {
    if (hash === "#storage" || hash.includes("storage")) {
      return `${LABELS.system} · ${LABELS.storage}`;
    }
    return LABELS.system;
  }
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  return LABELS[segment] ?? capitalize(segment.replace(/-/g, " "));
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
