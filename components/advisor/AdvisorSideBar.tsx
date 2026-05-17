"use client";

import {
  Terminal,
  ArrowLeftRight,
  RotateCcw,
  MessageSquarePlus,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useChatStore } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

export default function AdvisorSideBar() {
  const {
    sessions,
    activeSessionId,
    fetchSessions,
    createSession,
    setActiveSession,
    deleteSession,
    isLoading,
  } = useChatStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  const handleStartNewChat = () => {
    setIsModalOpen(true);
  };

  const submitNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newChatTitle.trim() || "New Chat";

    // Close immediately for snappy UX
    setIsModalOpen(false);
    setNewChatTitle("");

    await createSession(title);
  };

  const handleQuickAction = async (label: string) => {
    const id = await createSession(label);
    if (id) {
      // Small timeout to allow WebSocket connection
      setTimeout(() => {
        useChatStore.getState().sendMessage(label);
      }, 500);
    }
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-3 w-28" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Sessions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Conversations
          </h4>
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/90"
          >
            <MessageSquarePlus size={14} />
            New Chat
          </button>
        </div>

        <div className="space-y-2 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group flex w-full items-center justify-between rounded-md border p-3 text-left transition-all",
                activeSessionId === session.id
                  ? "border-primary/20 bg-primary/10"
                  : "border-transparent hover:border-border hover:bg-primary/5",
              )}
            >
              <button
                onClick={() => setActiveSession(session.id)}
                className="flex items-center gap-3 flex-1 overflow-hidden"
              >
                <MessageCircle
                  size={16}
                  className={
                    activeSessionId === session.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />
                <p
                  className={`text-xs font-medium truncate ${activeSessionId === session.id ? "text-primary" : "text-muted-foreground"}`}
                >
                  {session.title || "New Chat"}
                </p>
              </button>

              <button
                onClick={() => deleteSession(session.id)}
                className="p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No previous conversations.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Quick Actions
        </h4>
        <div className="space-y-3">
          {[
            { label: "How do I improve my GitHub for DevOps?", icon: Terminal },
            {
              label: "Compare my profile to Senior Architect X",
              icon: ArrowLeftRight,
            },
            {
              label: "Check salary benchmarks in Addis Ababa",
              icon: RotateCcw,
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(action.label)}
              className="group flex w-full flex-col items-start gap-4 rounded-md border border-border p-4 text-left transition-all hover:border-primary/20 hover:bg-primary/5"
            >
              <div className="vs-icon-tile vs-icon-tile-primary h-8 w-8">
                <action.icon size={16} />
              </div>
              <p className="text-xs font-bold text-foreground leading-snug">
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Advisor Info Card */}
      <div className="vs-band relative mt-auto overflow-hidden rounded-xl p-8">
        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-primary/20 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <h3 className="text-xl font-bold">VentureScope Advisor</h3>
          <p className="vs-band-muted text-xs leading-relaxed">
            Leveraging GPT-4 Turbo and vector embeddings of over 2M job
            descriptions.
          </p>
          <div className="flex items-center gap-2 text-label text-accent">
            <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
            System Operational
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {isModalOpen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Start New Chat</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitNewChat} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="chat-title" className="text-sm font-medium text-muted-foreground">
                  Chat Title
                </label>
                <input
                  id="chat-title"
                  type="text"
                  autoFocus
                  placeholder="e.g. Resume Review"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring/20"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newChatTitle.trim()}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
                >
                  Create Chat
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

