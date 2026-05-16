"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/useAppStore";

/** Keeps Zustand `theme` in sync with next-themes (single resolved preference). */
export function ThemeSync() {
  const { theme, resolvedTheme } = useTheme();
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    if (!theme) {
      return;
    }
    setTheme(theme as "light" | "dark" | "system");
  }, [theme, setTheme]);

  useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.style.colorScheme = resolvedTheme;
    }
  }, [resolvedTheme]);

  return null;
}
