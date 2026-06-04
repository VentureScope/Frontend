"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";
import {
  COLOR_PALETTE_OPTIONS,
  DEFAULT_COLOR_PALETTE,
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
  useEffect(() => {
    if (!open) {
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

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  function handleSelect(next: ColorPalette) {
    onSelect(next);
    onOpenChange(false);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm motion-reduce:backdrop-blur-none"
        role="presentation"
        aria-hidden
        onClick={() => onOpenChange(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="color-palette-title"
        className={cn(
          "fixed top-0 right-0 z-[70] flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-xl",
          "transition-transform duration-200 motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
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
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close accent color picker"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <p className="mb-4 text-sm text-muted-foreground">
            Choose an accent palette for buttons, charts, and highlights across
            the site. Light and dark mode stay independent.
          </p>

          <div className="space-y-3" role="listbox" aria-label="Accent palettes">
            {COLOR_PALETTE_OPTIONS.map((option) => {
              const selected = palette === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
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
      </aside>
    </>
  );
}
