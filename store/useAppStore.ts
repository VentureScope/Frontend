import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthSessionData } from "@/types/auth";

const APP_STORAGE_KEY = "app-storage";
const AUTH_DATA_STORAGE_KEY = "auth-data";
const GOOGLE_OAUTH_SESSION_KEY = "google_oauth_tx";
const GITHUB_OAUTH_SESSION_KEY = "github_oauth_tx";

function syncAuthDataToBrowserStorage(authData: AuthSessionData): void {
  if (typeof window === "undefined") {
    return;
  }

  const serializedAuthData = JSON.stringify(authData);
  localStorage.setItem(AUTH_DATA_STORAGE_KEY, serializedAuthData);
  sessionStorage.setItem(AUTH_DATA_STORAGE_KEY, serializedAuthData);
}

function clearBrowserAuthStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_DATA_STORAGE_KEY);
  localStorage.removeItem(APP_STORAGE_KEY);
  sessionStorage.removeItem(APP_STORAGE_KEY);
  sessionStorage.removeItem(GOOGLE_OAUTH_SESSION_KEY);
  sessionStorage.removeItem(GITHUB_OAUTH_SESSION_KEY);
}

const EMPTY_AUTH_DATA: AuthSessionData = {
  token: null,
  tokenType: null,
  user: null,
};

interface AppState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  authData: AuthSessionData;
  setAuthData: (data: AuthSessionData) => void;
  clearAuth: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      authData: EMPTY_AUTH_DATA,
      setAuthData: (authData) => {
        syncAuthDataToBrowserStorage(authData);
        set({ authData });
      },
      clearAuth: () => {
        clearBrowserAuthStorage();
        set({ authData: EMPTY_AUTH_DATA });
      },
    }),
    {
      name: APP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, authData: state.authData }), // optionally pick fields to persist
    },
  ),
);
