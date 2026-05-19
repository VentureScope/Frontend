const ADMIN_LABELS: Record<string, string> = {
  admin: "Overview",
  users: "Users",
  organizations: "Organizations",
  settings: "Settings",
};

function capitalize(segment: string): string {
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function getAdminBreadcrumb(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") {
    return ADMIN_LABELS.admin;
  }

  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  const root = segments[0];

  if (!root) {
    return ADMIN_LABELS.admin;
  }

  return ADMIN_LABELS[root] ?? capitalize(root.replace(/-/g, " "));
}
