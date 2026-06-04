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
