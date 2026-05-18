"use client";

import { useEffect } from "react";
import { Bot } from "lucide-react";
import { ChatPromptChips } from "@/components/chat/ChatPromptChips";
import { ChatSessionList } from "@/components/chat/ChatSessionList";
import { useChatStore } from "@/store/useChatStore";
import { Skeleton } from "@/components/ui/skeleton";

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
    setActiveSession,
    deleteSession,
    sendMessage,
    isLoading,
    isConnecting,
  } = useChatStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  async function handleNewChat() {
    await createSession("New conversation");
  }

  async function handleQuickPrompt(text: string) {
    const id = await createSession(text.slice(0, 48));
    if (id) {
      setTimeout(() => sendMessage(text), 400);
    }
  }

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex h-full flex-col gap-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
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
          title: s.title || "New chat",
        }))}
        activeId={activeSessionId}
        onSelect={setActiveSession}
        onDelete={deleteSession}
        onNewChat={() => void handleNewChat()}
      />

      <div className="shrink-0 space-y-2 border-t border-border pt-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Try asking
        </p>
        <ChatPromptChips
          disabled={isConnecting}
          prompts={QUICK_PROMPTS.map((label) => ({
            label,
            onClick: () => void handleQuickPrompt(label),
          }))}
        />
      </div>
    </div>
  );
}
