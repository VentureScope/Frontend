"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const AdminGitHubSyncs = lazyAdminNamedPage(
  () => import("@/components/admin/pages/AdminGitHubSyncs"),
  "AdminGitHubSyncs",
);

export default function AdminGitHubSyncsPage() {
  return <AdminGitHubSyncs />;
}
