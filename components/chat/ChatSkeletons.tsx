"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ChatNewChatButtonSkeleton() {
  return <Skeleton className="h-10 w-full rounded-xl" />;
}

export function ChatSessionListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <ChatNewChatButtonSkeleton />
      <div className="space-y-1">
        {Array.from({ length: rows }).map((_, i) => (
          <ChatSessionItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ChatSessionItemSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3 w-[85%]" />
        <Skeleton className="h-2 w-1/2" />
      </div>
      <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
    </div>
  );
}

function MessageBubbleSkeleton({ align }: { align: "user" | "assistant" }) {
  const isUser = align === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <Skeleton className="h-8 w-8 shrink-0 rounded-full" />}
      <div
        className={`max-w-[min(100%,40rem)] space-y-2 rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md bg-muted/40"
            : "rounded-bl-md bg-muted/30"
        }`}
      >
        <Skeleton className={`h-3 ${isUser ? "w-32" : "w-full max-w-md"}`} />
        <Skeleton className={`h-3 ${isUser ? "w-24" : "w-4/5 max-w-sm"}`} />
        {!isUser && <Skeleton className="h-3 w-2/3 max-w-xs" />}
      </div>
      {isUser && <Skeleton className="h-8 w-8 shrink-0 rounded-full" />}
    </div>
  );
}

/** Suspense / initial load for the main advisor panel. */
export function ChatWelcomeSkeleton() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4"
      aria-busy
      aria-label="Loading advisor"
    >
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <Skeleton className="h-7 w-56 max-w-full" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <Skeleton className="mt-2 h-11 w-44 rounded-xl" />
    </div>
  );
}

/** Main conversation panel while loading or switching chats. */
export function ChatConversationSkeleton() {
  return (
    <div
      className="space-y-5 pb-2 pt-2"
      aria-busy
      aria-label="Loading conversation"
    >
      <MessageBubbleSkeleton align="user" />
      <MessageBubbleSkeleton align="assistant" />
      <MessageBubbleSkeleton align="user" />
      <MessageBubbleSkeleton align="assistant" />
    </div>
  );
}
