const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Overview",
  "learning-path": "Learning Path",
  "ai-advisor": "AI Advisor",
  "resume-builder": "Resume Builder",
  "data-hub": "Data Hub",
  "market-trends": "Market Trends",
  settings: "Settings",
  profile: "Profile",
};

export function getDashboardBreadcrumb(pathname: string): string {
  if (pathname === "/dashboard") {
    return BREADCRUMB_LABELS.dashboard;
  }

  const segments = pathname.replace(/^\/dashboard\/?/, "").split("/");
  const root = segments[0];

  if (!root) {
    return BREADCRUMB_LABELS.dashboard;
  }

  return BREADCRUMB_LABELS[root] ?? root.split("-").map(capitalize).join(" ");
}

function capitalize(segment: string): string {
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
