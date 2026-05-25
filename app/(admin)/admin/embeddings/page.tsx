import { redirect } from "next/navigation";

export default function AdminEmbeddingsRedirectPage() {
  redirect("/admin/ml-runs");
}
