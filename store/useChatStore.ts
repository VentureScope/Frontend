import { create } from "zustand";
import api from "@/lib/api";
import {
  deriveChatTitle,
  isPlaceholderChatTitle,
  normalizeChatTitle,
} from "@/lib/chat-utils";
import { useAppStore } from "./useAppStore";

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id?: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

const SESSIONS_STALE_MS = 60_000;

export interface ChatState {
  sessions: ChatSession[];
  sessionsFetchedAt: number | null;
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  isFetchingSessions: boolean;
  isSessionBusy: boolean;
  deletingSessionId: string | null;
  isConnecting: boolean;
  isTyping: boolean;
  error: string | null;
  ws: WebSocket | null;

  fetchSessions: (options?: { force?: boolean }) => Promise<void>;
  createSession: (title?: string | null) => Promise<string | null>;
  startNewChatWithMessage: (content: string) => Promise<string | null>;
  setActiveSession: (id: string) => Promise<void>;
  renameSession: (id: string, title: string) => Promise<void>;
  sendMessage: (content: string) => void;
  deleteSession: (id: string) => Promise<void>;
  disconnect: () => void;
}

function waitForChatWebSocket(
  getState: () => ChatState,
  sessionId: string,
  timeoutMs = 15000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();

    const check = () => {
      const { ws, activeSessionId, error } = getState();

      if (error) {
        reject(new Error(error));
        return;
      }

      if (ws && activeSessionId === sessionId && ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (
        ws &&
        (ws.readyState === WebSocket.CLOSING ||
          ws.readyState === WebSocket.CLOSED)
      ) {
        reject(new Error("WebSocket closed before it could connect"));
        return;
      }

      if (Date.now() - started > timeoutMs) {
        reject(new Error("WebSocket connection timed out"));
        return;
      }

      window.setTimeout(check, 50);
    };

    check();
  });
}

function applySessionTitle(
  sessions: ChatSession[],
  sessionId: string,
  title: string,
): ChatSession[] {
  return sessions.map((s) => (s.id === sessionId ? { ...s, title } : s));
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  sessionsFetchedAt: null,
  activeSessionId: null,
  activeSession: null,
  isFetchingSessions: false,
  isSessionBusy: false,
  deletingSessionId: null,
  isConnecting: false,
  isTyping: false,
  error: null,
  ws: null,

  fetchSessions: async (options) => {
    const { isFetchingSessions, sessions, sessionsFetchedAt } = get();
    if (isFetchingSessions) {
      return;
    }
    const isFresh =
      sessions.length > 0 &&
      sessionsFetchedAt != null &&
      Date.now() - sessionsFetchedAt < SESSIONS_STALE_MS;
    if (!options?.force && isFresh) {
      return;
    }

    set({ isFetchingSessions: true, error: null });
    try {
      const { data } = await api.get("/api/chat/sessions");
      set({
        sessions: data,
        isFetchingSessions: false,
        sessionsFetchedAt: Date.now(),
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load conversations";
      set({ error: message, isFetchingSessions: false });
    }
  },

  renameSession: async (id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      const { data } = await api.patch(`/api/chat/sessions/${id}`, {
        title: trimmed,
      });
      set((state) => ({
        sessions: applySessionTitle(state.sessions, id, data.title ?? trimmed),
        activeSession:
          state.activeSession?.id === id
            ? { ...state.activeSession, title: data.title ?? trimmed }
            : state.activeSession,
      }));
    } catch (error) {
      console.error("Failed to rename session:", error);
    }
  },

  createSession: async (title?: string | null) => {
    const sessionTitle = normalizeChatTitle(title ?? "");
    set({ isSessionBusy: true, error: null });
    try {
      const { data } = await api.post("/api/chat/sessions", {
        title: sessionTitle,
      });
      set((state) => ({
        sessions: [data, ...state.sessions],
        sessionsFetchedAt: Date.now(),
        isSessionBusy: true,
      }));
      await get().setActiveSession(data.id);
      return data.id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create conversation";
      set({ error: message, isSessionBusy: false });
      return null;
    }
  },

  startNewChatWithMessage: async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return null;

    get().disconnect();

    const id = await get().createSession(deriveChatTitle(trimmed));
    if (!id) return null;

    try {
      await waitForChatWebSocket(get, id);
      get().sendMessage(trimmed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "WebSocket connection failed";
      console.error("Failed to send initial advisor message:", message);
      set({ error: message, isConnecting: false, isSessionBusy: false });
    }

    return id;
  },

  setActiveSession: async (id: string) => {
    const currentWs = get().ws;
    if (currentWs) {
      currentWs.close();
    }

    set({
      activeSessionId: id,
      isSessionBusy: true,
      error: null,
      activeSession: null,
      isConnecting: false,
    });

    try {
      const { data } = await api.get(`/api/chat/sessions/${id}`);
      set({ activeSession: data, isSessionBusy: false });

      const token = useAppStore.getState().authData.token;
      if (!token) throw new Error("No auth token");

      const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(
        /^http/,
        "ws",
      )}/api/chat/ws/${id}?token=${token}`;

      set({ isConnecting: true });

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        set({ isConnecting: false });
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          set((state) => {
            if (!state.activeSession) return state;
            const messages = state.activeSession.messages || [];
            const lastMessage = messages[messages.length - 1];
            const sessionId = state.activeSession.id;

            if (parsed.event === "chunk") {
              if (
                lastMessage &&
                lastMessage.role === "assistant" &&
                !lastMessage.id
              ) {
                const updatedMessages = [...messages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMessage,
                  content: lastMessage.content + (parsed.data || ""),
                };
                return {
                  isTyping: false,
                  activeSession: {
                    ...state.activeSession,
                    messages: updatedMessages,
                  },
                };
              }

              const newMsg: ChatMessage = {
                session_id: sessionId,
                role: "assistant",
                content: parsed.data || "",
              };
              return {
                isTyping: false,
                activeSession: {
                  ...state.activeSession,
                  messages: [...messages, newMsg],
                },
              };
            }

            if (parsed.event === "done") {
              let nextSessions = state.sessions;
              let nextActive = state.activeSession;
              const serverTitle =
                typeof parsed.session_title === "string"
                  ? parsed.session_title
                  : typeof parsed.title === "string"
                    ? parsed.title
                    : null;

              if (serverTitle && !isPlaceholderChatTitle(serverTitle)) {
                nextSessions = applySessionTitle(
                  nextSessions,
                  sessionId,
                  serverTitle,
                );
                nextActive = { ...nextActive, title: serverTitle };
              }

              if (
                lastMessage &&
                lastMessage.role === "assistant" &&
                !lastMessage.id
              ) {
                const updatedMessages = [...messages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMessage,
                  id: parsed.message_id,
                };
                return {
                  isTyping: false,
                  sessions: nextSessions,
                  activeSession: {
                    ...nextActive,
                    messages: updatedMessages,
                  },
                };
              }

              return {
                isTyping: false,
                sessions: nextSessions,
                activeSession: nextActive,
              };
            }

            if (parsed.event === "error") {
              console.error("AI Error:", parsed.detail);
              return { isTyping: false };
            }

            return state;
          });
        } catch (e) {
          console.error("WebSocket message parse error:", e);
        }
      };

      ws.onerror = () => {
        set({
          isConnecting: false,
          error: "WebSocket connection failed",
        });
      };

      ws.onclose = () => {
        set({ ws: null, isConnecting: false });
      };

      set({ ws });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load conversation";
      set({
        error: message,
        isSessionBusy: false,
        isConnecting: false,
      });
    }
  },

  sendMessage: (content: string) => {
    const { ws, activeSessionId, activeSession, sessions } = get();
    if (
      !ws ||
      ws.readyState !== WebSocket.OPEN ||
      !activeSessionId ||
      !activeSession
    ) {
      console.error("WebSocket not connected");
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) return;

    const userCount = (activeSession.messages ?? []).filter(
      (m) => m.role === "user",
    ).length;
    const shouldRename =
      userCount === 0 && isPlaceholderChatTitle(activeSession.title);

    const newMsg: ChatMessage = {
      session_id: activeSessionId,
      role: "user",
      content: trimmed,
    };

    const nextTitle = shouldRename ? deriveChatTitle(trimmed) : activeSession.title;

    set((state) => ({
      activeSession: {
        ...state.activeSession!,
        title: nextTitle,
        messages: [...(state.activeSession!.messages || []), newMsg],
      },
      sessions: shouldRename
        ? applySessionTitle(state.sessions, activeSessionId, nextTitle)
        : state.sessions,
      isTyping: true,
    }));

    if (shouldRename) {
      void get().renameSession(activeSessionId, nextTitle);
    }

    ws.send(JSON.stringify({ event: "message", message: trimmed }));
  },

  deleteSession: async (id: string) => {
    set({ deletingSessionId: id, isSessionBusy: true, error: null });
    try {
      await api.delete(`/api/chat/sessions/${id}`);
      const wasActive = get().activeSessionId === id;
      if (wasActive) get().disconnect();

      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
        sessionsFetchedAt: Date.now(),
        activeSession: wasActive ? null : state.activeSession,
        activeSessionId: wasActive ? null : state.activeSessionId,
        deletingSessionId: null,
        isSessionBusy: false,
      }));
    } catch (error) {
      console.error(error);
      set({
        deletingSessionId: null,
        isSessionBusy: false,
        error: "Failed to delete conversation",
      });
    }
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null, isConnecting: false });
    }
  },
}));
