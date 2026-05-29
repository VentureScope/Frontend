"use client";

import { memo } from "react";
import { Bot } from "lucide-react";
import { AssistantMessageContent } from "@/components/chat/AssistantMessageContent";

export type ChatDisplayMessage = {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatMessageRowProps = {
  msg: ChatDisplayMessage;
  index: number;
  userInitial: string;
  userAvatarUrl?: string;
  formatAssistant: boolean;
};

const ChatMessageRow = memo(function ChatMessageRow({
  msg,
  index,
  userInitial,
  userAvatarUrl,
  formatAssistant,
}: ChatMessageRowProps) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
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
});

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
      {messages.map((msg, i) => (
        <ChatMessageRow
          key={msg.id ?? i}
          msg={msg}
          index={i}
          userInitial={userInitial}
          userAvatarUrl={userAvatarUrl}
          formatAssistant={formatAssistant}
        />
      ))}

      {isTyping && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted/60 px-4 py-3">
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
