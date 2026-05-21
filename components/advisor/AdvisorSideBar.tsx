"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { ChatPromptChips } from "@/components/chat/ChatPromptChips";
import { ChatSessionList } from "@/components/chat/ChatSessionList";
import { ChatSessionListSkeleton } from "@/components/chat/ChatSkeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { NewChatTitleDialog } from "@/components/chat/NewChatTitleDialog";
import { useChatStore } from "@/store/useChatStore";

const QUICK_PROMPTS = [
  "How do I improve my GitHub for DevOps?",
  "Compare my profile to a senior architect",
  "Check salary benchmarks in my city",
];

export default function AdvisorSideBar() {
  const {
    sessions,
    activeSessionId,
    fetchSessions,
    createSession,
    startNewChatWithMessage,
    setActiveSession,
    deleteSession,
    isFetchingSessions,
    isSessionBusy,
    deletingSessionId,
    isConnecting,
  } = useChatStore();

  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  async function handleTitleConfirm(title: string) {
    setIsCreating(true);
    try {
      await createSession(title);
      setTitleDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleQuickPrompt(text: string) {
    await startNewChatWithMessage(text);
  }

  if (isFetchingSessions && sessions.length === 0) {
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
        <ChatSessionListSkeleton />
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
            <p className="text-sm font-semibold text-foreground">AI Advisor</p>
            <p className="text-[11px] text-muted-foreground">Personal career help</p>
          </div>
        </div>

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
          isBusy={isSessionBusy}
          deletingId={deletingSessionId}
        />

        <div className="shrink-0 space-y-2 border-t border-border pt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Try asking
          </p>
          <ChatPromptChips
            disabled={isConnecting || isSessionBusy || isCreating}
            prompts={QUICK_PROMPTS.map((label) => ({
              label,
              onClick: () => void handleQuickPrompt(label),
            }))}
          />
        </div>
      </div>

      <NewChatTitleDialog
        open={titleDialogOpen}
        onOpenChange={setTitleDialogOpen}
        onConfirm={handleTitleConfirm}
        isSubmitting={isCreating}
        description="Name this chat so it is easy to spot in your conversation list."
      />
    </>
  );
}
