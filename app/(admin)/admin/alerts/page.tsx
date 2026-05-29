"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const AdminAlerts = lazyAdminNamedPage(
  () => import("@/components/admin/pages/AdminAlerts"),
  "AdminAlerts",
);

export default function AdminAlertsPage() {
  return <AdminAlerts />;
}
