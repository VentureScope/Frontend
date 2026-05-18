"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { OrgAdvisorOrgPicker } from "@/components/organization/advisor/OrgAdvisorOrgPicker";
import { ChatPromptChips } from "@/components/chat/ChatPromptChips";
import { ChatSessionList } from "@/components/chat/ChatSessionList";
import { ORG_ADVISOR_QUICK_PROMPTS } from "@/lib/org-advisor-mock";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";
import { useOrgAdvisorStore } from "@/store/useOrgAdvisorStore";

export function OrgAdvisorSidebar() {
  const {
    selectedOrgId,
    setSelectedOrgId,
    sessions,
    activeSessionId,
    createSession,
    setActiveSession,
    deleteSession,
    sendMessage,
    isTyping,
  } = useOrgAdvisorStore();

  const selectedOrg = MOCK_ORGANIZATIONS.find((o) => o.id === selectedOrgId);

  function handleQuickPrompt(prompt: string, label: string) {
    const id = createSession(label, selectedOrgId);
    setActiveSession(id);
    setTimeout(() => sendMessage(prompt), 100);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Org Advisor</p>
          <p className="text-[11px] text-muted-foreground">Team-level planning</p>
        </div>
      </div>

      <OrgAdvisorOrgPicker
        organizations={MOCK_ORGANIZATIONS}
        value={selectedOrgId}
        onChange={setSelectedOrgId}
      />
      {selectedOrg && (
        <p className="-mt-2 text-[11px] text-muted-foreground">
          Using {selectedOrg.name}&apos;s profile, members, and roadmaps.
        </p>
      )}

      <ChatSessionList
        sessions={sessions.map((s) => {
          const org = MOCK_ORGANIZATIONS.find((o) => o.id === s.orgId);
          return {
            id: s.id,
            title: s.title,
            subtitle: org?.name,
          };
        })}
        activeId={activeSessionId}
        onSelect={setActiveSession}
        onDelete={deleteSession}
        onNewChat={() => createSession("New conversation", selectedOrgId)}
      />

      <div className="shrink-0 space-y-2 border-t border-border pt-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Suggestions
        </p>
        <ChatPromptChips
          disabled={isTyping}
          prompts={ORG_ADVISOR_QUICK_PROMPTS.map((item) => ({
            label: item.label,
            onClick: () => handleQuickPrompt(item.prompt, item.label),
          }))}
        />
        <p className="text-[11px] text-muted-foreground">
          For personal growth, use{" "}
          <Link
            href="/dashboard/ai-advisor"
            className="font-medium text-primary hover:underline"
          >
            AI Advisor
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
