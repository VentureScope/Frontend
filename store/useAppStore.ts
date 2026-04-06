import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthSessionData } from "@/types/auth";

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
      authData: { token: null, tokenType: null, user: null },
      setAuthData: (authData) => set({ authData }),
      clearAuth: () =>
        set({ authData: { token: null, tokenType: null, user: null } }),
    }),
    {
      name: "app-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ theme: state.theme, authData: state.authData }), // optionally pick fields to persist
    },
  ),
);
