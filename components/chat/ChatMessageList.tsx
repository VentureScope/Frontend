"use client";

import { Bot } from "lucide-react";
import { AssistantMessageContent } from "@/components/chat/AssistantMessageContent";

export type ChatDisplayMessage = {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatMessageListProps = {
  messages: ChatDisplayMessage[];
  isTyping?: boolean;
  userInitial?: string;
  userAvatarUrl?: string;
  formatAssistant?: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
};

export function ChatMessageList({
  messages,
  isTyping = false,
  userInitial = "Y",
  userAvatarUrl,
  formatAssistant = true,
  messagesEndRef,
}: ChatMessageListProps) {
  return (
    <div className="space-y-5 pb-2">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const key = msg.id ?? i;

        return (
          <div
            key={key}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
          >
            {!isUser && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[min(100%,40rem)] px-4 py-2.5 text-sm leading-relaxed ${
                isUser
                  ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-2xl rounded-bl-md bg-muted/60 text-foreground"
              }`}
            >
              {isUser || !formatAssistant ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <AssistantMessageContent content={msg.content} />
              )}
            </div>
            {isUser && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-foreground">
                {userAvatarUrl ? (
                  <img
                    src={userAvatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial.charAt(0).toUpperCase()
                )}
              </div>
            )}
          </div>
        );
      })}

      {isTyping && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted/60 px-4 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
