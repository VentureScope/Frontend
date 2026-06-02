import { Suspense } from "react";
import ChatInterface from "@/components/advisor/ChatInterface";
import AdvisorSidebar from "@/components/advisor/AdvisorSideBar";
import { ChatPageShell } from "@/components/chat/ChatPageShell";
import { ChatWelcomeSkeleton } from "@/components/chat/ChatSkeletons";

export default function AdvisorPage() {
  return (
    <ChatPageShell toggleId="advisor-sidebar" sidebar={<AdvisorSidebar />}>
      <Suspense fallback={<ChatWelcomeSkeleton />}>
        <ChatInterface />
      </Suspense>
    </ChatPageShell>
  );
}
