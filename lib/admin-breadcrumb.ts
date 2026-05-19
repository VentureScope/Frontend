const LABELS: Record<string, string> = {
  admin: "Overview",
  directory: "User Directory",
  permissions: "Permissions",
  transcripts: "Transcripts",
  embeddings: "Embeddings Monitor",
  "github-syncs": "GitHub Syncs",
  knowledge: "Knowledge Base",
  "chat-logs": "Chat Logs",
  "prompt-config": "Prompt Config",
  broadcasts: "Broadcasts",
  alerts: "System Alerts",
  system: "Technical Health",
  config: "System Config",
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getAdminBreadcrumb(pathname: string): string {
  if (pathname === "/admin") return LABELS.admin;
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  return LABELS[segment] ?? capitalize(segment.replace(/-/g, " "));
}
