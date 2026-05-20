import { AdminPlaceholder } from "@/components/admin/pages/AdminPlaceholder";

export default function Page() {
  return (
    <AdminPlaceholder
      title="System Config"
      description="Feature flags, rate limits, and environment toggles."
      noApi
    />
  );
}
