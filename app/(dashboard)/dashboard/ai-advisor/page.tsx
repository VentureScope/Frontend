import { Suspense } from "react";
import ChatInterface from "@/components/advisor/ChatInterface";
import AdvisorSidebar from "@/components/advisor/AdvisorSideBar";
import { ChatPageShell } from "@/components/chat/ChatPageShell";

export default function AdvisorPage() {
  return (
    <ChatPageShell toggleId="advisor-sidebar" sidebar={<AdvisorSidebar />}>
      <Suspense fallback={null}>
        <ChatInterface />
      </Suspense>
    </ChatPageShell>
  );
}
