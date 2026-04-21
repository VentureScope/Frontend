"use client";

import {
  Terminal,
  ArrowLeftRight,
  RotateCcw,
  MessageSquarePlus,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Skeleton } from "@/components/ui/skeleton";

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

  const handleStartNewChat = async () => {
    await createSession("New Chat");
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
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Conversations
          </h4>
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <MessageSquarePlus size={14} />
            New Chat
          </button>
        </div>

        <div className="space-y-2 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center justify-between w-full p-3 rounded-xl border transition-all text-left ${
                activeSessionId === session.id
                  ? "border-blue-200 bg-blue-50/50"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <button
                onClick={() => setActiveSession(session.id)}
                className="flex items-center gap-3 flex-1 overflow-hidden"
              >
                <MessageCircle
                  size={16}
                  className={
                    activeSessionId === session.id
                      ? "text-blue-600"
                      : "text-slate-400"
                  }
                />
                <p
                  className={`text-xs font-medium truncate ${activeSessionId === session.id ? "text-blue-900" : "text-slate-700"}`}
                >
                  {session.title || "New Chat"}
                </p>
              </button>

              <button
                onClick={() => deleteSession(session.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              No previous conversations.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
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
              className="group flex flex-col items-start gap-4 w-full p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-left"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100">
                <action.icon size={16} />
              </div>
              <p className="text-xs font-bold text-slate-800 leading-snug">
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Advisor Info Card */}
      <div className="mt-auto rounded-[32px] bg-[#020617] p-8 text-white relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <h3 className="text-xl font-bold">VentureScope Advisor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Leveraging GPT-4 Turbo and vector embeddings of over 2M job
            descriptions.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            System Operational
          </div>
        </div>
      </div>
    </div>
  );
}
