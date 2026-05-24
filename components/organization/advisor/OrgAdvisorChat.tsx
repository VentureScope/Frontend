"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Sparkles } from "lucide-react";
import { CHAT_CONTENT_WIDTH, CHAT_MAIN_PADDING } from "@/components/chat/chat-layout";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatConversationSkeleton } from "@/components/chat/ChatSkeletons";
import { cn } from "@/lib/utils";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatPromptChips } from "@/components/chat/ChatPromptChips";
import { ORG_ADVISOR_QUICK_PROMPTS } from "@/lib/org-advisor-mock";
import { deriveChatTitle } from "@/lib/chat-utils";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";
import { useOrgAdvisorStore } from "@/store/useOrgAdvisorStore";
import { useAppStore } from "@/store/useAppStore";

export function OrgAdvisorChat() {
  const authUser = useAppStore((s) => s.authData.user);
  const { organizations } = useOrganizationsList();
  const {
    selectedOrgId,
    isTyping,
    isSessionBusy,
    isConnecting,
    createSession,
    startNewChatWithMessage,
    sendMessage,
    getActiveSession,
    error,
  } = useOrgAdvisorStore();

  const activeSession = getActiveSession();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const org =
    organizations.find(
      (o) => o.id === (activeSession?.org_id ?? selectedOrgId),
    ) ?? null;

  const displayName = authUser?.full_name?.split(" ")[0] ?? "there";
  const messages = activeSession?.messages ?? [];
  const showWelcome =
    !isSessionBusy && !isConnecting && (!activeSession || messages.length === 0);
  const showLoading = (isSessionBusy || isConnecting) && !isTyping;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping || isSessionBusy || !selectedOrgId) return;

    if (!activeSession) {
      await createSession(deriveChatTitle(text), selectedOrgId);
    }
    sendMessage(text);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  async function runPrompt(prompt: string, label: string) {
    if (isTyping || isSessionBusy || !selectedOrgId) return;
    await startNewChatWithMessage(prompt, label);
  }

  return (
    <div className="flex h-full flex-col">
      <header
        className={cn(
          "hidden shrink-0 border-b border-border py-3 lg:block",
          CHAT_MAIN_PADDING,
        )}
      >
        <div className={cn("flex items-center gap-2", CHAT_CONTENT_WIDTH)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-foreground">
              {activeSession?.title ?? "Org Advisor"}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {showLoading
                ? "Loading conversation…"
                : org
                  ? `Planning for ${org.name}`
                  : "Select an organization in the sidebar"}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className={cn(CHAT_CONTENT_WIDTH, CHAT_MAIN_PADDING)}>
          {error && !showLoading ? (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {showLoading ? (
            <ChatConversationSkeleton />
          ) : showWelcome ? (
            <div className="flex min-h-[40vh] flex-col items-start gap-6 pt-4 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Hi {displayName}, how can I help{" "}
                  {org?.name ?? "your team"}?
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Hiring, upskilling, roadmaps, and workforce planning using your
                  org profile and team data.
                </p>
              </div>
              <ChatPromptChips
                disabled={isTyping || isSessionBusy || !selectedOrgId}
                prompts={ORG_ADVISOR_QUICK_PROMPTS.map((item) => ({
                  label: item.label,
                  onClick: () => void runPrompt(item.prompt, item.label),
                }))}
              />
            </div>
          ) : (
            <ChatMessageList
              messages={messages.map((m) => ({
                id: m.id || undefined,
                role: m.role as "user" | "assistant" | "system",
                content: m.content,
              }))}
              isTyping={isTyping}
              userInitial={displayName}
              formatAssistant
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>
      </div>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={() => void handleSend()}
        onKeyDown={handleKeyDown}
        disabled={isTyping || isSessionBusy || !selectedOrgId}
        placeholder={
          isSessionBusy
            ? "Please wait…"
            : org
              ? `Ask about ${org.name}…`
              : "Ask about hiring, roadmaps, or planning…"
        }
        hint={
          <>
            Planning guidance only — not legal or HR advice.{" "}
            <Link
              href="/dashboard/ai-advisor"
              className="text-primary hover:underline"
            >
              Personal career help →
            </Link>
          </>
        }
      />
    </div>
  );
}
