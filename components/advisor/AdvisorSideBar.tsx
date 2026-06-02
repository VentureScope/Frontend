"use client";

import { useEffect, useMemo } from "react";
import { Bot } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { ChatSessionList } from "@/components/chat/ChatSessionList";
import { ChatSessionListSkeleton } from "@/components/chat/ChatSkeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatStore } from "@/store/useChatStore";

type AdvisorSideBarProps = {
  sidebarToggleId?: string;
};

export default function AdvisorSideBar({
  sidebarToggleId = "advisor-sidebar",
}: AdvisorSideBarProps) {
  const {
    sessions,
    activeSessionId,
    fetchSessions,
    setActiveSession,
    deleteSession,
    isFetchingSessions,
    isSessionBusy,
    deletingSessionId,
  } = useChatStore(
    useShallow((s) => ({
      sessions: s.sessions,
      activeSessionId: s.activeSessionId,
      fetchSessions: s.fetchSessions,
      setActiveSession: s.setActiveSession,
      deleteSession: s.deleteSession,
      isFetchingSessions: s.isFetchingSessions,
      isSessionBusy: s.isSessionBusy,
      deletingSessionId: s.deletingSessionId,
    })),
  );

  const sessionItems = useMemo(
    () =>
      sessions.map((s) => ({
        id: s.id,
        title: s.title || "Untitled",
      })),
    [sessions],
  );

  useEffect(() => {
    const toggle = document.getElementById(sidebarToggleId) as
      | HTMLInputElement
      | null;
    const desktop = window.matchMedia("(min-width: 1024px)");

    const loadIfNeeded = () => {
      void fetchSessions();
    };

    if (desktop.matches) {
      loadIfNeeded();
    }

    const onToggle = () => {
      if (toggle?.checked) {
        loadIfNeeded();
      }
    };

    toggle?.addEventListener("change", onToggle);

    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        loadIfNeeded();
      }
    };

    desktop.addEventListener("change", onDesktopChange);

    return () => {
      toggle?.removeEventListener("change", onToggle);
      desktop.removeEventListener("change", onDesktopChange);
    };
  }, [fetchSessions, sidebarToggleId]);

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
        <ChatSessionListSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Chat history</p>
          <p className="text-[11px] text-muted-foreground">
            Resume a past conversation
          </p>
        </div>
      </div>

      <ChatSessionList
        sessions={sessionItems}
        activeId={activeSessionId}
        onSelect={(id) => void setActiveSession(id)}
        onDelete={(id) => void deleteSession(id)}
        showNewChatButton={false}
        emptyLabel="No conversations yet — start one in the main panel"
        isBusy={isSessionBusy}
        deletingId={deletingSessionId}
      />
    </div>
  );
}
