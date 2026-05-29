"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const EmbeddingsMonitor = lazyAdminNamedPage(
  () => import("@/components/admin/pages/EmbeddingsMonitor"),
  "EmbeddingsMonitor",
);

export default function AdminMlRunsPage() {
  return <EmbeddingsMonitor />;
}
