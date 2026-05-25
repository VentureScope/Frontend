import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { PRIVACY_POLICY_SECTIONS } from "@/lib/legal-documents";

export const metadata = {
  title: "Privacy Policy | VentureScope",
  description:
    "How VentureScope collects, uses, and protects your personal and career data.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentView
      title="Privacy Policy"
      subtitle="How we handle account, profile, learning, and integration data on VentureScope."
      sections={PRIVACY_POLICY_SECTIONS}
    />
  );
}
