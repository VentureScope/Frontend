"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const AdminSystemConfig = lazyAdminNamedPage(
  () => import("@/components/admin/pages/AdminSystemConfig"),
  "AdminSystemConfig",
);

export default function AdminConfigPage() {
  return <AdminSystemConfig />;
}
