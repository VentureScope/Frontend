/** Accent palette ids — applied via `data-palette` on `<html>`. */
export const COLOR_PALETTES = ["green", "blue", "orange", "violet"] as const;

export type ColorPalette = (typeof COLOR_PALETTES)[number];

export const DEFAULT_COLOR_PALETTE: ColorPalette = "green";

export const COLOR_PALETTE_STORAGE_KEY = "venturescope-color-palette";

export type ColorPaletteOption = {
  id: ColorPalette;
  label: string;
  /** Swatch preview for the picker UI (M3). */
  swatch: string;
  description: string;
};

/** Curated presets — token values live in `app/globals.css`. */
export const COLOR_PALETTE_OPTIONS: ColorPaletteOption[] = [
  {
    id: "green",
    label: "Green",
    swatch: "#4a6b5a",
    description: "Sage green — default VentureScope accent.",
  },
  {
    id: "blue",
    label: "Blue",
    swatch: "#4a5f6b",
    description: "Steel blue — cool, professional.",
  },
  {
    id: "orange",
    label: "Orange",
    swatch: "#856648",
    description: "Burnt amber — warm terracotta accent.",
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#634f70",
    description: "Muted plum — soft violet accent.",
  },
];

export function isColorPalette(value: string): value is ColorPalette {
  return (COLOR_PALETTES as readonly string[]).includes(value);
}

export function readStoredColorPalette(): ColorPalette {
  if (typeof window === "undefined") {
    return DEFAULT_COLOR_PALETTE;
  }
  const stored = window.localStorage.getItem(COLOR_PALETTE_STORAGE_KEY);
  return stored && isColorPalette(stored) ? stored : DEFAULT_COLOR_PALETTE;
}

export function writeStoredColorPalette(palette: ColorPalette): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(COLOR_PALETTE_STORAGE_KEY, palette);
}

/** Apply accent palette to `<html>` — green clears `data-palette` (CSS default). */
export function applyColorPaletteToDocument(palette: ColorPalette): void {
  if (typeof document === "undefined") {
    return;
  }
  if (palette === DEFAULT_COLOR_PALETTE) {
    document.documentElement.removeAttribute("data-palette");
    return;
  }
  document.documentElement.dataset.palette = palette;
}

/** Live preview only — does not write to storage. */
export function previewColorPalette(palette: ColorPalette): void {
  applyColorPaletteToDocument(palette);
}

/** Restore the saved palette after preview or bfcache restore. */
export function restoreStoredColorPalette(): ColorPalette {
  const stored = readStoredColorPalette();
  applyColorPaletteToDocument(stored);
  return stored;
}

export const COLOR_PALETTE_CHANGE_EVENT = "venturescope:color-palette-change";

export function dispatchColorPaletteChange(palette: ColorPalette): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<ColorPalette>(COLOR_PALETTE_CHANGE_EVENT, {
      detail: palette,
    }),
  );
}

/**
 * Inline script for `layout.tsx` — sets `data-palette` before first paint.
 * Keep in sync with read/apply helpers above.
 */
export const COLOR_PALETTE_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(COLOR_PALETTE_STORAGE_KEY)};var v=localStorage.getItem(k);if(v==="blue"||v==="orange"||v==="violet"){document.documentElement.setAttribute("data-palette",v);}}catch(e){}})();`;
