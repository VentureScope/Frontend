import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  // user auth placeholder
  authData: { token: string | null; user: null | object };
  setAuthData: (data: { token: string | null; user: null | object }) => void;
  clearAuth: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      authData: { token: null, user: null },
      setAuthData: (authData) => set({ authData }),
      clearAuth: () => set({ authData: { token: null, user: null } }),
    }),
    {
      name: 'app-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ theme: state.theme, authData: state.authData }), // optionally pick fields to persist
    }
  )
);
