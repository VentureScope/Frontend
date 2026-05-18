import { create } from "zustand";
import { persist } from "zustand/middleware";
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

  setSelectedOrgId: (orgId: string) => void;
  createSession: (title?: string, orgId?: string) => string;
  setActiveSession: (id: string | null) => void;
  deleteSession: (id: string) => void;
  sendMessage: (content: string) => void;
  getActiveSession: () => OrgAdvisorSession | null;
}

export const useOrgAdvisorStore = create<OrgAdvisorState>()(
  persist(
    (set, get) => ({
      selectedOrgId: MOCK_ORGANIZATIONS[0]?.id ?? "acme-corp",
      sessions: [],
      activeSessionId: null,
      isTyping: false,

      setSelectedOrgId: (orgId) => set({ selectedOrgId: orgId }),

      createSession: (title = "New conversation", orgId) => {
        const id = newId("org-chat");
        const org = orgId ?? get().selectedOrgId;
        const session: OrgAdvisorSession = {
          id,
          title,
          orgId: org,
          messages: [],
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
        }));
        return id;
      },

      setActiveSession: (id) => set({ activeSessionId: id }),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeSessionId:
            state.activeSessionId === id ? null : state.activeSessionId,
        })),

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId) ?? null;
      },

      sendMessage: (content) => {
        const trimmed = content.trim();
        if (!trimmed) return;

        let { activeSessionId, sessions, selectedOrgId } = get();
        let session = sessions.find((s) => s.id === activeSessionId);

        if (!session) {
          const newId = get().createSession("Org planning chat");
          session = get().sessions.find((s) => s.id === newId);
          activeSessionId = newId;
        }

        if (!session) return;

        const sessionId = session.id;

        const userMsg: OrgAdvisorMessage = {
          id: newId("msg"),
          role: "user",
          content: trimmed,
          createdAt: new Date().toISOString(),
        };

        const updatedTitle =
          session.messages.length === 0
            ? trimmed.slice(0, 48) + (trimmed.length > 48 ? "…" : "")
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
            (o) => o.id === (session.orgId || selectedOrgId),
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
