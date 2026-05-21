import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  deriveChatTitle,
  isPlaceholderChatTitle,
  normalizeChatTitle,
} from "@/lib/chat-utils";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";
import { mockOrgAdvisorReply } from "@/lib/org-advisor-mock";

export interface OrgAdvisorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface OrgAdvisorSession {
  id: string;
  title: string;
  orgId: string;
  messages: OrgAdvisorMessage[];
  updatedAt: string;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface OrgAdvisorState {
  selectedOrgId: string;
  sessions: OrgAdvisorSession[];
  activeSessionId: string | null;
  isTyping: boolean;
  isSessionBusy: boolean;
  deletingSessionId: string | null;

  setSelectedOrgId: (orgId: string) => void;
  createSession: (title?: string, orgId?: string) => Promise<string>;
  setActiveSession: (id: string | null) => void;
  deleteSession: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  getActiveSession: () => OrgAdvisorSession | null;
}

export const useOrgAdvisorStore = create<OrgAdvisorState>()(
  persist(
    (set, get) => ({
      selectedOrgId: MOCK_ORGANIZATIONS[0]?.id ?? "acme-corp",
      sessions: [],
      activeSessionId: null,
      isTyping: false,
      isSessionBusy: false,
      deletingSessionId: null,

      setSelectedOrgId: (orgId) => set({ selectedOrgId: orgId }),

      createSession: async (title, orgId) => {
        set({ isSessionBusy: true });
        await new Promise((r) => window.setTimeout(r, 120));

        const id = newId("org-chat");
        const org = orgId ?? get().selectedOrgId;
        const sessionTitle = normalizeChatTitle(title ?? "");
        const session: OrgAdvisorSession = {
          id,
          title: sessionTitle,
          orgId: org,
          messages: [],
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
          isSessionBusy: false,
        }));
        return id;
      },

      setActiveSession: (id) => {
        if (!id) {
          set({ activeSessionId: null, isSessionBusy: false });
          return;
        }
        set({ isSessionBusy: true, activeSessionId: id });
        window.setTimeout(() => {
          set({ isSessionBusy: false });
        }, 80);
      },

      deleteSession: async (id) => {
        set({ deletingSessionId: id, isSessionBusy: true });
        await new Promise((r) => window.setTimeout(r, 150));
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeSessionId:
            state.activeSessionId === id ? null : state.activeSessionId,
          deletingSessionId: null,
          isSessionBusy: false,
        }));
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId) ?? null;
      },

      sendMessage: async (content) => {
        const trimmed = content.trim();
        if (!trimmed || get().isSessionBusy) return;

        let { activeSessionId, sessions, selectedOrgId } = get();
        let session = sessions.find((s) => s.id === activeSessionId);

        if (!session) {
          await get().createSession(
            normalizeChatTitle(""),
            selectedOrgId,
          );
          activeSessionId = get().activeSessionId;
          session = get().sessions.find((s) => s.id === activeSessionId);
        }

        if (!session || !activeSessionId) return;

        const sessionId = session.id;

        const userMsg: OrgAdvisorMessage = {
          id: newId("msg"),
          role: "user",
          content: trimmed,
          createdAt: new Date().toISOString(),
        };

        const userCount = session.messages.filter((m) => m.role === "user").length;
        const updatedTitle =
          userCount === 0 && isPlaceholderChatTitle(session.title)
            ? deriveChatTitle(trimmed)
            : session.title;

        set((state) => ({
          isTyping: true,
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  title: updatedTitle,
                  messages: [...s.messages, userMsg],
                  updatedAt: new Date().toISOString(),
                }
              : s,
          ),
        }));

        const org =
          MOCK_ORGANIZATIONS.find(
            (o) => o.id === (session!.orgId || selectedOrgId),
          ) ?? null;

        window.setTimeout(() => {
          const reply = mockOrgAdvisorReply(trimmed, org);
          const assistantMsg: OrgAdvisorMessage = {
            id: newId("msg"),
            role: "assistant",
            content: reply,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            isTyping: false,
            sessions: state.sessions.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    messages: [...s.messages, assistantMsg],
                    updatedAt: new Date().toISOString(),
                  }
                : s,
            ),
          }));
        }, 900 + Math.random() * 600);
      },
    }),
    {
      name: "venturescope-org-advisor",
      partialize: (state) => ({
        selectedOrgId: state.selectedOrgId,
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
    },
  ),
);
