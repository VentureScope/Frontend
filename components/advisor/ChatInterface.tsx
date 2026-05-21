"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Sparkles } from "lucide-react";
import { CHAT_CONTENT_WIDTH, CHAT_MAIN_PADDING } from "@/components/chat/chat-layout";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatConversationSkeleton } from "@/components/chat/ChatSkeletons";
import { cn } from "@/lib/utils";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatPromptChips } from "@/components/chat/ChatPromptChips";
import { consumeAdvisorPendingMessage } from "@/lib/advisor-launch";
import { deriveChatTitle } from "@/lib/chat-utils";
import { useChatStore } from "@/store/useChatStore";
import { useAppStore } from "@/store/useAppStore";

const STARTER_PROMPTS = [
  "What skills should I focus on next?",
  "Review my profile for senior roles",
  "Salary benchmarks in my market",
];

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const {
    activeSession,
    activeSessionId,
    sendMessage,
    createSession,
    startNewChatWithMessage,
    setActiveSession,
    isConnecting,
    isTyping,
    isSessionBusy,
  } = useChatStore();
  const authUser = useAppStore((s) => s.authData.user);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingLaunchHandled = useRef(false);

  const displayName = authUser?.full_name?.split(" ")[0] ?? "there";
  const messages = activeSession?.messages ?? [];
  const showWelcome =
    !isSessionBusy && (!activeSession || messages.length === 0);
  const showLoading = isSessionBusy && !isTyping;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (pendingLaunchHandled.current) return;
    const pending = consumeAdvisorPendingMessage();
    if (!pending) return;
    pendingLaunchHandled.current = true;
    void startNewChatWithMessage(pending);
  }, [startNewChatWithMessage]);

  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (!sessionId || activeSessionId === sessionId) return;
    void setActiveSession(sessionId);
  }, [searchParams, activeSessionId, setActiveSession]);

  async function ensureSession(firstMessage?: string) {
    if (activeSession) return activeSession.id;
    return createSession(
      firstMessage ? deriveChatTitle(firstMessage) : undefined,
    );
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isConnecting || isSessionBusy) return;
    await ensureSession(text);
    sendMessage(text);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  async function runPrompt(text: string) {
    if (isConnecting || isSessionBusy) return;
    await startNewChatWithMessage(text);
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
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              {activeSession?.title ?? "AI Advisor"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {showLoading
                ? "Loading conversation…"
                : isConnecting
                  ? "Connecting…"
                  : "Career guidance for your profile"}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className={cn(CHAT_CONTENT_WIDTH, CHAT_MAIN_PADDING)}>
          {showLoading ? (
            <ChatConversationSkeleton />
          ) : showWelcome ? (
            <div className="flex min-h-[40vh] flex-col items-start gap-6 pt-4 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Hi {displayName}, how can I help?
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Ask about skills, roles, salary, or your learning path. Pick a
                  suggestion or type below.
                </p>
              </div>
              <ChatPromptChips
                disabled={isConnecting || isSessionBusy}
                prompts={STARTER_PROMPTS.map((label) => ({
                  label,
                  onClick: () => void runPrompt(label),
                }))}
              />
            </div>
          ) : (
            <ChatMessageList
              messages={messages}
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
        disabled={isConnecting || isSessionBusy}
        placeholder={
          isSessionBusy
            ? "Please wait…"
            : isConnecting
              ? "Connecting…"
              : "Ask your AI advisor…"
        }
        hint="Enter to send · Shift+Enter for a new line"
      />
    </div>
  );
}
