"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const AdminTranscripts = lazyAdminNamedPage(
  () => import("@/components/admin/pages/AdminTranscripts"),
  "AdminTranscripts",
);

export default function AdminTranscriptsPage() {
  return <AdminTranscripts />;
}
