"use client";

import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorPaletteTriggerProps = {
  open: boolean;
  onOpen: () => void;
  disabled?: boolean;
  className?: string;
};

export function ColorPaletteTrigger({
  open,
  onOpen,
  disabled = false,
  className,
}: ColorPaletteTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      aria-label="Choose accent color"
      aria-expanded={open}
      aria-haspopup="dialog"
      title="Accent color"
      className={cn(
        "no-print fixed right-0 top-[42%] z-50 flex h-12 w-10 -translate-y-1/2 items-center justify-center",
        "rounded-l-lg border border-r-0 border-border bg-card/95 text-muted-foreground shadow-md",
        "backdrop-blur-sm transition-colors hover:bg-card hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "motion-reduce:transition-none",
        open && "border-primary/30 bg-primary/5 text-primary",
        className,
      )}
    >
      <Palette className="h-4 w-4" strokeWidth={2} aria-hidden />
    </button>
  );
}
