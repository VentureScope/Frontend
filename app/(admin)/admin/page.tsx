"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const AdminOverview = lazyAdminNamedPage(
  () => import("@/components/admin/pages/AdminOverview"),
  "AdminOverview",
);

export default function AdminPage() {
  return <AdminOverview />;
}
