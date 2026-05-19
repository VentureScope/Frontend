import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AdminSessionData } from "@/types/admin-auth";

const ADMIN_STORAGE_KEY = "admin-storage";
const ADMIN_AUTH_DATA_KEY = "admin-auth-data";

const EMPTY_ADMIN_SESSION: AdminSessionData = {
  token: null,
  tokenType: null,
  user: null,
};

function syncAdminAuthToStorage(session: AdminSessionData): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(session);
  localStorage.setItem(ADMIN_AUTH_DATA_KEY, serialized);
  sessionStorage.setItem(ADMIN_AUTH_DATA_KEY, serialized);
}

function clearAdminBrowserStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_AUTH_DATA_KEY);
  sessionStorage.removeItem(ADMIN_AUTH_DATA_KEY);
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  sessionStorage.removeItem(ADMIN_STORAGE_KEY);
}

interface AdminState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  authData: AdminSessionData;
  setAuthData: (data: AdminSessionData) => void;
  clearAuth: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      authData: EMPTY_ADMIN_SESSION,
      setAuthData: (authData) => {
        syncAdminAuthToStorage(authData);
        set({ authData });
      },
      clearAuth: () => {
        clearAdminBrowserStorage();
        set({ authData: EMPTY_ADMIN_SESSION });
      },
    }),
    {
      name: ADMIN_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        authData: state.authData,
      }),
    },
  ),
);
