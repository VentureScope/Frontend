"use client";

import { OrgAdvisorChat } from "@/components/organization/advisor/OrgAdvisorChat";
import { OrgAdvisorSidebar } from "@/components/organization/advisor/OrgAdvisorSidebar";
import { ChatPageShell } from "@/components/chat/ChatPageShell";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";

export function OrgAdvisorPageClient() {
  const { organizations, loading: orgsLoading } = useOrganizationsList();

  return (
    <ChatPageShell
      toggleId="org-advisor-sidebar"
      className="-mx-4 -mt-2 sm:-mx-6 lg:-mx-8"
      sidebar={
        <OrgAdvisorSidebar
          organizations={organizations}
          orgsLoading={orgsLoading}
        />
      }
    >
      <OrgAdvisorChat organizations={organizations} />
    </ChatPageShell>
  );
}
