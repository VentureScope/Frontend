"use client";

import { MessageSquarePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatSessionItem = {
  id: string;
  title: string;
  subtitle?: string;
};

type ChatSessionListProps = {
  sessions: ChatSessionItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
  newChatLabel?: string;
  emptyLabel?: string;
};

export function ChatSessionList({
  sessions,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
  newChatLabel = "New chat",
  emptyLabel = "No conversations yet",
}: ChatSessionListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <button
        type="button"
        onClick={onNewChat}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
      >
        <MessageSquarePlus className="h-4 w-4 text-primary" />
        {newChatLabel}
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
        {sessions.length === 0 ? (
          <p className="px-1 py-4 text-center text-xs text-muted-foreground">
            {emptyLabel}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {sessions.map((session) => {
              const active = activeId === session.id;
              return (
                <li
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-lg transition-colors",
                    active ? "bg-primary/10" : "hover:bg-muted/60",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(session.id)}
                    className="min-w-0 flex-1 px-3 py-2.5 text-left"
                  >
                    <p
                      className={cn(
                        "truncate text-xs font-medium",
                        active ? "text-primary" : "text-foreground",
                      )}
                    >
                      {session.title || "New chat"}
                    </p>
                    {session.subtitle ? (
                      <p className="truncate text-[10px] text-muted-foreground">
                        {session.subtitle}
                      </p>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(session.id)}
                    className="mr-1 shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
