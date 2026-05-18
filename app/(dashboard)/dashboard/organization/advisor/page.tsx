import { OrgAdvisorChat } from "@/components/organization/advisor/OrgAdvisorChat";
import { OrgAdvisorSidebar } from "@/components/organization/advisor/OrgAdvisorSidebar";
import { ChatPageShell } from "@/components/chat/ChatPageShell";

export default function OrgAdvisorPage() {
  return (
    <ChatPageShell
      toggleId="org-advisor-sidebar"
      className="-mx-4 -mt-2 sm:-mx-6 lg:-mx-8"
      sidebar={<OrgAdvisorSidebar />}
    >
      <OrgAdvisorChat />
    </ChatPageShell>
  );
}
