"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot } from "lucide-react";
import { OrgAdvisorOrgPicker } from "@/components/organization/advisor/OrgAdvisorOrgPicker";
import { ChatPromptChips } from "@/components/chat/ChatPromptChips";
import { ChatSessionList } from "@/components/chat/ChatSessionList";
import { ChatSessionListSkeleton } from "@/components/chat/ChatSkeletons";
import { NewChatTitleDialog } from "@/components/chat/NewChatTitleDialog";
import { ORG_ADVISOR_QUICK_PROMPTS } from "@/lib/org-advisor-mock";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";
import { useOrgAdvisorStore } from "@/store/useOrgAdvisorStore";
import { Skeleton } from "@/components/ui/skeleton";

export function OrgAdvisorSidebar() {
  const { organizations, loading: orgsLoading } = useOrganizationsList();
  const {
    selectedOrgId,
    setSelectedOrgId,
    sessions,
    activeSessionId,
    fetchSessions,
    createSession,
    startNewChatWithMessage,
    setActiveSession,
    deleteSession,
    isFetchingSessions,
    isTyping,
    isSessionBusy,
    deletingSessionId,
  } = useOrgAdvisorStore();

  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);

  useEffect(() => {
    if (orgsLoading || organizations.length === 0) return;

    const valid =
      selectedOrgId && organizations.some((o) => o.id === selectedOrgId);
    if (!valid) {
      setSelectedOrgId(organizations[0].id);
      return;
    }

    void fetchSessions();
  }, [
    orgsLoading,
    organizations,
    selectedOrgId,
    setSelectedOrgId,
    fetchSessions,
  ]);

  async function handleTitleConfirm(title: string) {
    setIsCreating(true);
    try {
      await createSession(title, selectedOrgId);
      setTitleDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleQuickPrompt(prompt: string, label: string) {
    if (!selectedOrgId) return;
    await startNewChatWithMessage(prompt, label);
  }

  if (orgsLoading && organizations.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <ChatSessionListSkeleton />
      </div>
    );
  }

  if (!orgsLoading && organizations.length === 0) {
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
        <p className="text-sm text-muted-foreground">
          Join or create an organization to use org-level planning chat.{" "}
          <Link
            href="/dashboard/organization"
            className="font-medium text-primary hover:underline"
          >
            Organizations
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
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
          organizations={organizations}
          value={selectedOrgId}
          onChange={setSelectedOrgId}
        />
        {selectedOrg ? (
          <p className="-mt-2 text-[11px] text-muted-foreground">
            Using {selectedOrg.name}&apos;s profile, members, and roadmaps.
          </p>
        ) : null}

        {isFetchingSessions && sessions.length === 0 ? (
          <ChatSessionListSkeleton />
        ) : (
          <ChatSessionList
            sessions={sessions.map((s) => ({
              id: s.id,
              title: s.title || "Untitled",
            }))}
            activeId={activeSessionId}
            onSelect={(id) => void setActiveSession(id)}
            onDelete={(id) => void deleteSession(id)}
            onNewChat={() => setTitleDialogOpen(true)}
            isCreating={isCreating}
            isBusy={isSessionBusy || !selectedOrgId}
            deletingId={deletingSessionId}
          />
        )}

        <div className="shrink-0 space-y-2 border-t border-border pt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Suggestions
          </p>
          <ChatPromptChips
            disabled={
              isTyping || isSessionBusy || isCreating || !selectedOrgId
            }
            prompts={ORG_ADVISOR_QUICK_PROMPTS.map((item) => ({
              label: item.label,
              onClick: () => void handleQuickPrompt(item.prompt, item.label),
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

      <NewChatTitleDialog
        open={titleDialogOpen}
        onOpenChange={setTitleDialogOpen}
        onConfirm={handleTitleConfirm}
        isSubmitting={isCreating}
        description={
          selectedOrg
            ? `Name this planning chat for ${selectedOrg.name}.`
            : "Name this org planning conversation."
        }
      />
    </>
  );
}
