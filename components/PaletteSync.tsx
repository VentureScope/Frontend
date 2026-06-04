"use client";

import { useEffect } from "react";
import {
  applyColorPaletteToDocument,
  COLOR_PALETTE_CHANGE_EVENT,
  readStoredColorPalette,
  type ColorPalette,
} from "@/lib/color-palette";

/** Re-applies stored accent palette on mount and cross-tab / hook updates. */
export function PaletteSync() {
  useEffect(() => {
    applyColorPaletteToDocument(readStoredColorPalette());

    function onPaletteChange(event: Event) {
      const detail = (event as CustomEvent<ColorPalette>).detail;
      applyColorPaletteToDocument(
        detail ?? readStoredColorPalette(),
      );
    }

    window.addEventListener(COLOR_PALETTE_CHANGE_EVENT, onPaletteChange);
    return () => {
      window.removeEventListener(COLOR_PALETTE_CHANGE_EVENT, onPaletteChange);
    };
  }, []);

  return null;
}
