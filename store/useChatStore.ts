import { create } from "zustand";
import api from "@/lib/api";
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

export interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  isLoading: boolean;
  isConnecting: boolean;
  isTyping: boolean;
  error: string | null;
  ws: WebSocket | null;

  fetchSessions: () => Promise<void>;
  createSession: (title?: string) => Promise<string | null>;
  setActiveSession: (id: string) => Promise<void>;
  sendMessage: (content: string) => void;
  deleteSession: (id: string) => Promise<void>;
  disconnect: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  activeSession: null,
  isLoading: false,
  isConnecting: false,
  isTyping: false,
  error: null,
  ws: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/api/chat/sessions");
      set({ sessions: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createSession: async (title = "New Chat") => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/api/chat/sessions", { title });
      set((state) => ({
        sessions: [data, ...state.sessions],
        isLoading: false,
      }));
      await get().setActiveSession(data.id);
      return data.id;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  setActiveSession: async (id: string) => {
    const currentWs = get().ws;
    if (currentWs) {
      currentWs.close();
    }

    set({
      activeSessionId: id,
      isLoading: true,
      error: null,
      activeSession: null,
    });

    try {
      const { data } = await api.get(`/api/chat/sessions/${id}`);
      set({ activeSession: data, isLoading: false });

      // Connect WebSocket
      const token = useAppStore.getState().authData.token;
      if (!token) throw new Error("No auth token");

      const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(
        /^http/,
        "ws",
      )}/api/chat/ws/${id}?token=${token}`;

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

            if (parsed.event === "chunk") {
              // Append to existing streaming assistant message or create a new one
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
              } else {
                const newMsg: ChatMessage = {
                  session_id: id,
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
            } else if (parsed.event === "done") {
              // Assign the message_id when the stream is complete
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
                  activeSession: {
                    ...state.activeSession,
                    messages: updatedMessages,
                  },
                };
              }
            } else if (parsed.event === "error") {
              console.error("AI Error:", parsed.detail);
              return { isTyping: false };
            }

            return state; // No state change for other events like "notification"
          });
        } catch (e) {
          console.error("WebSocket message parse error:", e);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        set({ ws: null });
      };

      set({ ws });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: (content: string) => {
    const { ws, activeSessionId, activeSession } = get();
    if (
      !ws ||
      ws.readyState !== WebSocket.OPEN ||
      !activeSessionId ||
      !activeSession
    ) {
      console.error("WebSocket not connected");
      return;
    }

    const newMsg: ChatMessage = {
      session_id: activeSessionId,
      role: "user",
      content,
    };

    set((state) => ({
      activeSession: {
        ...state.activeSession!,
        messages: [...(state.activeSession!.messages || []), newMsg],
      },
      isTyping: true,
    }));

    // Send payload formatted as a JSON object, try "message" instead of "content"
    ws.send(JSON.stringify({ event: "message", message: content }));
  },

  deleteSession: async (id: string) => {
    try {
      await api.delete(`/api/chat/sessions/${id}`);
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
        activeSession:
          state.activeSessionId === id ? null : state.activeSession,
        activeSessionId:
          state.activeSessionId === id ? null : state.activeSessionId,
      }));
      if (get().activeSessionId === id) get().disconnect();
    } catch (error) {
      console.error(error);
    }
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null });
    }
  },
}));
