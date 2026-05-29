"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const TechnicalHealth = lazyAdminNamedPage(
  () => import("@/components/admin/pages/TechnicalHealth"),
  "TechnicalHealth",
);

export default function AdminSystemPage() {
  return <TechnicalHealth />;
}
