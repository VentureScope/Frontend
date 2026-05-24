import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  deriveChatTitle,
  isPlaceholderChatTitle,
  normalizeChatTitle,
} from "@/lib/chat-utils";
import {
  createOrganizationChatSession,
  deleteOrganizationChatSession,
  getOrganizationChatSession,
  listOrganizationChatSessions,
  renameOrganizationChatSession,
} from "@/lib/organizations-api";
import {
  parseOrgChatSessionList,
  parseOrgChatSessionOutApi,
  parseOrgChatSessionWithMessagesApi,
} from "@/lib/organization-chat-parsers";
import type {
  OrgChatMessageOutApi,
  OrgChatSessionOutApi,
  OrgChatSessionWithMessagesApi,
} from "@/types/organization-api";
import { useAppStore } from "./useAppStore";

export type OrgAdvisorMessage = OrgChatMessageOutApi;

export type OrgAdvisorSession = OrgChatSessionWithMessagesApi;

function waitForOrgChatWebSocket(
  getState: () => OrgAdvisorState,
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
  sessions: OrgChatSessionOutApi[],
  sessionId: string,
  title: string,
): OrgChatSessionOutApi[] {
  return sessions.map((s) => (s.id === sessionId ? { ...s, title } : s));
}

function buildOrgChatWsUrl(orgId: string, sessionId: string, token: string) {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") ?? "";
  return `${base}/api/organizations/${orgId}/chat/ws/${sessionId}?token=${token}`;
}

interface OrgAdvisorState {
  selectedOrgId: string;
  sessions: OrgChatSessionOutApi[];
  activeSessionId: string | null;
  activeSession: OrgAdvisorSession | null;
  isFetchingSessions: boolean;
  isSessionBusy: boolean;
  deletingSessionId: string | null;
  isConnecting: boolean;
  isTyping: boolean;
  error: string | null;
  ws: WebSocket | null;

  setSelectedOrgId: (orgId: string) => void;
  fetchSessions: () => Promise<void>;
  createSession: (title?: string | null, orgId?: string) => Promise<string | null>;
  startNewChatWithMessage: (
    content: string,
    title?: string | null,
  ) => Promise<string | null>;
  setActiveSession: (id: string) => Promise<void>;
  renameSession: (id: string, title: string) => Promise<void>;
  sendMessage: (content: string) => void;
  deleteSession: (id: string) => Promise<void>;
  disconnect: () => void;
  getActiveSession: () => OrgAdvisorSession | null;
}

export const useOrgAdvisorStore = create<OrgAdvisorState>()(
  persist(
    (set, get) => ({
      selectedOrgId: "",
      sessions: [],
      activeSessionId: null,
      activeSession: null,
      isFetchingSessions: false,
      isSessionBusy: false,
      deletingSessionId: null,
      isConnecting: false,
      isTyping: false,
      error: null,
      ws: null,

      setSelectedOrgId: (orgId) => {
        if (orgId === get().selectedOrgId) return;
        get().disconnect();
        set({
          selectedOrgId: orgId,
          sessions: [],
          activeSessionId: null,
          activeSession: null,
          error: null,
        });
        if (orgId) void get().fetchSessions();
      },

      fetchSessions: async () => {
        const orgId = get().selectedOrgId;
        if (!orgId) {
          set({ sessions: [], isFetchingSessions: false });
          return;
        }

        set({ isFetchingSessions: true, error: null });
        try {
          const data = await listOrganizationChatSessions(orgId);
          set({
            sessions: parseOrgChatSessionList(data),
            isFetchingSessions: false,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load conversations";
          set({ error: message, sessions: [], isFetchingSessions: false });
        }
      },

      renameSession: async (id, title) => {
        const orgId = get().selectedOrgId;
        if (!orgId) return;

        const trimmed = title.trim();
        if (!trimmed) return;

        try {
          const data = await renameOrganizationChatSession(orgId, id, {
            title: trimmed,
          });
          const parsed = parseOrgChatSessionWithMessagesApi(data);
          const nextTitle = parsed?.title ?? trimmed;

          set((state) => ({
            sessions: applySessionTitle(state.sessions, id, nextTitle),
            activeSession:
              state.activeSession?.id === id
                ? { ...state.activeSession, title: nextTitle }
                : state.activeSession,
          }));
        } catch (error) {
          console.error("Failed to rename org chat session:", error);
        }
      },

      createSession: async (title?: string | null, orgId?: string) => {
        const targetOrgId = orgId ?? get().selectedOrgId;
        if (!targetOrgId) return null;

        const sessionTitle = normalizeChatTitle(title ?? "");
        set({ isSessionBusy: true, error: null });

        try {
          const data = await createOrganizationChatSession(targetOrgId, {
            title: sessionTitle,
          });
          const parsed = parseOrgChatSessionOutApi(data);
          if (!parsed) throw new Error("Invalid session response");

          set((state) => ({
            sessions: [parsed, ...state.sessions],
            selectedOrgId: targetOrgId,
            isSessionBusy: true,
          }));

          await get().setActiveSession(parsed.id);
          return parsed.id;
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to create conversation";
          set({ error: message, isSessionBusy: false });
          return null;
        }
      },

      startNewChatWithMessage: async (content: string, title?: string | null) => {
        const trimmed = content.trim();
        if (!trimmed) return null;

        get().disconnect();

        const sessionTitle =
          title?.trim() || deriveChatTitle(trimmed);
        const id = await get().createSession(sessionTitle);
        if (!id) return null;

        try {
          await waitForOrgChatWebSocket(get, id);
          get().sendMessage(trimmed);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "WebSocket connection failed";
          console.error("Failed to send initial org advisor message:", message);
          set({ error: message, isConnecting: false, isSessionBusy: false });
        }

        return id;
      },

      setActiveSession: async (id: string) => {
        const orgId = get().selectedOrgId;
        if (!orgId) return;

        const currentWs = get().ws;
        if (currentWs) currentWs.close();

        set({
          activeSessionId: id,
          isSessionBusy: true,
          error: null,
          activeSession: null,
          isConnecting: false,
        });

        try {
          const data = await getOrganizationChatSession(orgId, id);
          const parsed = parseOrgChatSessionWithMessagesApi(data);
          if (!parsed) throw new Error("Invalid session response");

          set({ activeSession: parsed, isSessionBusy: false });

          const token = useAppStore.getState().authData.token;
          if (!token) throw new Error("No auth token");

          const wsUrl = buildOrgChatWsUrl(orgId, id, token);
          set({ isConnecting: true });

          const ws = new WebSocket(wsUrl);

          ws.onopen = () => {
            set({ isConnecting: false });
          };

          ws.onmessage = (event) => {
            try {
              const parsedMsg = JSON.parse(event.data);

              set((state) => {
                if (!state.activeSession) return state;
                const messages = state.activeSession.messages ?? [];
                const lastMessage = messages[messages.length - 1];
                const sessionId = state.activeSession.id;

                if (parsedMsg.event === "chunk") {
                  if (
                    lastMessage &&
                    lastMessage.role === "assistant" &&
                    !lastMessage.id
                  ) {
                    const updatedMessages = [...messages];
                    updatedMessages[updatedMessages.length - 1] = {
                      ...lastMessage,
                      content:
                        lastMessage.content + (parsedMsg.data || ""),
                    };
                    return {
                      isTyping: false,
                      activeSession: {
                        ...state.activeSession,
                        messages: updatedMessages,
                      },
                    };
                  }

                  const newMsg: OrgChatMessageOutApi = {
                    id: "",
                    session_id: sessionId,
                    role: "assistant",
                    content: parsedMsg.data || "",
                    created_at: new Date().toISOString(),
                  };

                  return {
                    isTyping: false,
                    activeSession: {
                      ...state.activeSession,
                      messages: [...messages, newMsg],
                    },
                  };
                }

                if (parsedMsg.event === "done") {
                  let nextSessions = state.sessions;
                  let nextActive = state.activeSession;
                  const serverTitle =
                    typeof parsedMsg.session_title === "string"
                      ? parsedMsg.session_title
                      : typeof parsedMsg.title === "string"
                        ? parsedMsg.title
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
                      id: parsedMsg.message_id ?? lastMessage.id,
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

                if (parsedMsg.event === "error") {
                  console.error("Org advisor error:", parsedMsg.detail);
                  return { isTyping: false };
                }

                return state;
              });
            } catch (e) {
              console.error("Org WebSocket message parse error:", e);
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
            error instanceof Error
              ? error.message
              : "Failed to load conversation";
          set({
            error: message,
            isSessionBusy: false,
            isConnecting: false,
          });
        }
      },

      sendMessage: (content: string) => {
        const { ws, activeSessionId, activeSession, selectedOrgId } = get();
        if (
          !ws ||
          ws.readyState !== WebSocket.OPEN ||
          !activeSessionId ||
          !activeSession ||
          !selectedOrgId
        ) {
          console.error("Org advisor WebSocket not connected");
          return;
        }

        const trimmed = content.trim();
        if (!trimmed) return;

        const userCount = (activeSession.messages ?? []).filter(
          (m) => m.role === "user",
        ).length;
        const shouldRename =
          userCount === 0 && isPlaceholderChatTitle(activeSession.title);

        const newMsg: OrgChatMessageOutApi = {
          id: "",
          session_id: activeSessionId,
          role: "user",
          content: trimmed,
          created_at: new Date().toISOString(),
        };

        const nextTitle = shouldRename
          ? deriveChatTitle(trimmed)
          : activeSession.title;

        set((state) => ({
          activeSession: {
            ...state.activeSession!,
            title: nextTitle,
            messages: [...(state.activeSession!.messages ?? []), newMsg],
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
        const orgId = get().selectedOrgId;
        if (!orgId) return;

        set({ deletingSessionId: id, isSessionBusy: true, error: null });
        try {
          await deleteOrganizationChatSession(orgId, id);
          const wasActive = get().activeSessionId === id;
          if (wasActive) get().disconnect();

          set((state) => ({
            sessions: state.sessions.filter((s) => s.id !== id),
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

      getActiveSession: () => get().activeSession,
    }),
    {
      name: "venturescope-org-advisor",
      partialize: (state) => ({
        selectedOrgId: state.selectedOrgId,
      }),
    },
  ),
);
