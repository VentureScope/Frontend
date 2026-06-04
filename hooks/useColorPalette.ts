"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyColorPaletteToDocument,
  COLOR_PALETTE_CHANGE_EVENT,
  DEFAULT_COLOR_PALETTE,
  dispatchColorPaletteChange,
  readStoredColorPalette,
  writeStoredColorPalette,
  type ColorPalette,
} from "@/lib/color-palette";

export function useColorPalette() {
  const [palette, setPaletteState] = useState<ColorPalette>(
    DEFAULT_COLOR_PALETTE,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredColorPalette();
    setPaletteState(stored);
    applyColorPaletteToDocument(stored);
    setReady(true);

    function onPaletteChange(event: Event) {
      const detail = (event as CustomEvent<ColorPalette>).detail;
      if (detail) {
        setPaletteState(detail);
        return;
      }
      setPaletteState(readStoredColorPalette());
    }

    window.addEventListener(COLOR_PALETTE_CHANGE_EVENT, onPaletteChange);
    return () => {
      window.removeEventListener(COLOR_PALETTE_CHANGE_EVENT, onPaletteChange);
    };
  }, []);

  const setPalette = useCallback((next: ColorPalette) => {
    setPaletteState(next);
    writeStoredColorPalette(next);
    applyColorPaletteToDocument(next);
    dispatchColorPaletteChange(next);
  }, []);

  return { palette, setPalette, ready };
}
