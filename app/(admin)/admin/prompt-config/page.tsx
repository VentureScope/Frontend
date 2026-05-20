import { AdminPlaceholder } from "@/components/admin/pages/AdminPlaceholder";

export default function Page() {
  return (
    <AdminPlaceholder
      title="Prompt Config"
      description="Manage system prompts, model routing, and safety policies."
      noApi
    />
  );
}
