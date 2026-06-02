"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, MessageSquarePlus, Sparkles } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { CHAT_CONTENT_WIDTH, CHAT_MAIN_PADDING } from "@/components/chat/chat-layout";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatConversationSkeleton } from "@/components/chat/ChatSkeletons";
import { cn } from "@/lib/utils";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatPromptChips } from "@/components/chat/ChatPromptChips";
import { NewChatTitleDialog } from "@/components/chat/NewChatTitleDialog";
import { consumeAdvisorPendingMessage } from "@/lib/advisor-launch";
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
  } = useChatStore(
    useShallow((s) => ({
      activeSession: s.activeSession,
      activeSessionId: s.activeSessionId,
      sendMessage: s.sendMessage,
      createSession: s.createSession,
      startNewChatWithMessage: s.startNewChatWithMessage,
      setActiveSession: s.setActiveSession,
      isConnecting: s.isConnecting,
      isTyping: s.isTyping,
      isSessionBusy: s.isSessionBusy,
    })),
  );

  const authUser = useAppStore((s) => s.authData.user);
  const [input, setInput] = useState("");
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingLaunchHandled = useRef(false);

  const displayName = authUser?.full_name?.split(" ")[0] ?? "there";
  const messages = activeSession?.messages ?? [];
  const hasActiveChat = Boolean(activeSession);
  const showWelcome = !hasActiveChat && !isSessionBusy;
  const showLoading = isSessionBusy && !hasActiveChat;
  const showEmptyChat =
    hasActiveChat && messages.length === 0 && !isTyping && !showLoading;

  useEffect(() => {
    return () => {
      useChatStore.getState().disconnect();
    };
  }, []);

  useEffect(() => {
    const { activeSessionId, ws, setActiveSession: reconnect } =
      useChatStore.getState();
    if (activeSessionId && !ws) {
      void reconnect(activeSessionId);
    }
  }, []);

  useEffect(() => {
    if (!hasActiveChat) {
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, hasActiveChat]);

  useEffect(() => {
    if (pendingLaunchHandled.current) {
      return;
    }
    const pending = consumeAdvisorPendingMessage();
    if (!pending) {
      return;
    }
    pendingLaunchHandled.current = true;
    void startNewChatWithMessage(pending);
  }, [startNewChatWithMessage]);

  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (!sessionId || activeSessionId === sessionId) {
      return;
    }
    void setActiveSession(sessionId);
  }, [searchParams, activeSessionId, setActiveSession]);

  async function handleTitleConfirm(title: string) {
    setIsCreating(true);
    try {
      await createSession(title);
      setTitleDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || !hasActiveChat || isConnecting || isSessionBusy) {
      return;
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

  async function runPrompt(text: string) {
    if (isConnecting || isSessionBusy || isCreating) {
      return;
    }
    await startNewChatWithMessage(text);
  }

  const composerDisabled = isConnecting || isSessionBusy;

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
                : showWelcome
                  ? "Start a conversation to begin"
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
            <div className="flex min-h-[min(60vh,520px)] flex-col items-center justify-center gap-6 px-2 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Hi {displayName}, ready to chat?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Start a new conversation to ask about skills, roles, salary, or
                  your learning path. Your chat history stays in the sidebar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTitleDialogOpen(true)}
                disabled={isCreating || isSessionBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageSquarePlus className="h-4 w-4" />
                {isCreating ? "Creating…" : "Start new conversation"}
              </button>
              <div className="w-full max-w-lg space-y-3 pt-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Or pick a topic to start with
                </p>
                <ChatPromptChips
                  className="justify-center"
                  disabled={isCreating || isConnecting || isSessionBusy}
                  prompts={STARTER_PROMPTS.map((label) => ({
                    label,
                    onClick: () => void runPrompt(label),
                  }))}
                />
              </div>
            </div>
          ) : showEmptyChat ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-8 text-center">
              <p className="text-sm font-medium text-foreground">
                {activeSession?.title ?? "New conversation"}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Send your first message below — the advisor uses your profile for
                personalized guidance.
              </p>
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

      {hasActiveChat ? (
        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={() => void handleSend()}
          onKeyDown={handleKeyDown}
          disabled={composerDisabled}
          placeholder={
            isSessionBusy
              ? "Please wait…"
              : isConnecting
                ? "Connecting…"
                : "Ask your AI advisor…"
          }
          hint="Enter to send · Shift+Enter for a new line"
        />
      ) : null}

      <NewChatTitleDialog
        open={titleDialogOpen}
        onOpenChange={setTitleDialogOpen}
        onConfirm={handleTitleConfirm}
        isSubmitting={isCreating}
        description="Name this chat so you can find it later in your conversation history."
      />
    </div>
  );
}
