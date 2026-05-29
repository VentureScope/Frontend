"use client";

import { lazyAdminNamedPage } from "@/lib/lazy-admin-page";

const AdminTaxonomy = lazyAdminNamedPage(
  () => import("@/components/admin/pages/AdminTaxonomy"),
  "AdminTaxonomy",
);

export default function AdminTaxonomyPage() {
  return <AdminTaxonomy />;
}
