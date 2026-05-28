"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const UserDirectory = lazyAdminNamedPage(
  () => import("@/components/admin/pages/UserDirectory"),
  "UserDirectory",
);

export default function AdminDirectoryPage() {
  return <UserDirectory />;
}
