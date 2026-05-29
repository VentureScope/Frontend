"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const AdminPermissions = lazyAdminNamedPage(
  () => import("@/components/admin/pages/AdminPermissions"),
  "AdminPermissions",
);

export default function AdminPermissionsPage() {
  return <AdminPermissions />;
}
