"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COLOR_PALETTE_OPTIONS,
  DEFAULT_COLOR_PALETTE,
  previewColorPalette,
  restoreStoredColorPalette,
  type ColorPalette,
} from "@/lib/color-palette";
import { cn } from "@/lib/utils";

type ColorPaletteSheetProps = {
  open: boolean;
  palette: ColorPalette;
  onOpenChange: (open: boolean) => void;
  onSelect: (palette: ColorPalette) => void;
};

export function ColorPaletteSheet({
  open,
  palette,
  onOpenChange,
  onSelect,
}: ColorPaletteSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [previewId, setPreviewId] = useState<ColorPalette | null>(null);

  useEffect(() => {
    if (!open) {
      setPreviewId(null);
      restoreStoredColorPalette();
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  function handleClose() {
    setPreviewId(null);
    restoreStoredColorPalette();
    onOpenChange(false);
  }

  function handleSelect(next: ColorPalette) {
    setPreviewId(null);
    onSelect(next);
    onOpenChange(false);
  }

  function handlePreview(next: ColorPalette) {
    setPreviewId(next);
    previewColorPalette(next);
  }

  function handleClearPreview() {
    setPreviewId(null);
    previewColorPalette(palette);
  }

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm motion-reduce:backdrop-blur-none"
        role="presentation"
        aria-hidden
        onClick={handleClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="color-palette-title"
        aria-describedby="color-palette-description"
        className={cn(
          "fixed top-0 right-0 z-[70] flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-xl",
          "transition-transform duration-200 motion-reduce:transition-none",
          "translate-x-0",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-5">
          <div>
            <p className="text-label text-primary">Appearance</p>
            <h2
              id="color-palette-title"
              className="text-sm font-semibold text-foreground"
            >
              Accent color
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close accent color picker"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <p
            id="color-palette-description"
            className="mb-4 text-sm text-muted-foreground"
          >
            Choose an accent palette for buttons, charts, and highlights across
            the site. Hover to preview; click to apply. Light and dark mode stay
            independent.
          </p>

          <div className="space-y-3" role="listbox" aria-label="Accent palettes">
            {COLOR_PALETTE_OPTIONS.map((option) => {
              const selected = palette === option.id;
              const previewing = previewId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(option.id)}
                  onMouseEnter={() => handlePreview(option.id)}
                  onMouseLeave={handleClearPreview}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : previewing
                        ? "border-primary/40 bg-primary/[0.03]"
                        : "border-border hover:border-primary/30 hover:bg-muted/40",
                  )}
                >
                  <span
                    className="h-11 w-11 shrink-0 rounded-lg border border-border shadow-sm"
                    style={{ backgroundColor: option.swatch }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {option.label}
                      </span>
                      {option.id === DEFAULT_COLOR_PALETTE ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Default
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                  {selected ? (
                    <Check
                      className="h-4 w-4 shrink-0 text-primary"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="shrink-0 border-t border-border p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={palette === DEFAULT_COLOR_PALETTE}
            onClick={() => handleSelect(DEFAULT_COLOR_PALETTE)}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset to default (Green)
          </Button>
        </div>
      </aside>
    </>
  );
}
