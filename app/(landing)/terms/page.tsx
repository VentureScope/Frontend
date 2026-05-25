import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { TERMS_OF_SERVICE_SECTIONS } from "@/lib/legal-documents";

export const metadata = {
  title: "Terms of Service | VentureScope",
  description:
    "Terms governing use of VentureScope career intelligence, AI advisors, and organization features.",
};

export default function TermsPage() {
  return (
    <LegalDocumentView
      title="Terms of Service"
      subtitle="Rules for using VentureScope's career intelligence platform, AI features, and organization workspaces."
      sections={TERMS_OF_SERVICE_SECTIONS}
    />
  );
}
