"use client";

import { useEffect } from "react";
import {
  applyColorPaletteToDocument,
  COLOR_PALETTE_CHANGE_EVENT,
  COLOR_PALETTE_STORAGE_KEY,
  readStoredColorPalette,
  restoreStoredColorPalette,
  type ColorPalette,
} from "@/lib/color-palette";

/** Re-applies stored accent palette on mount, bfcache, storage, and hook updates. */
export function PaletteSync() {
  useEffect(() => {
    applyColorPaletteToDocument(readStoredColorPalette());

    function onPaletteChange(event: Event) {
      const detail = (event as CustomEvent<ColorPalette>).detail;
      applyColorPaletteToDocument(
        detail ?? readStoredColorPalette(),
      );
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== COLOR_PALETTE_STORAGE_KEY) {
        return;
      }
      restoreStoredColorPalette();
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        restoreStoredColorPalette();
      }
    }

    window.addEventListener(COLOR_PALETTE_CHANGE_EVENT, onPaletteChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener(COLOR_PALETTE_CHANGE_EVENT, onPaletteChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
