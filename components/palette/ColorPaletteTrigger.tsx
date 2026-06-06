"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const PALETTE_HINT_SESSION_KEY = "venturescope-palette-tab-hint-seen";

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
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(PALETTE_HINT_SESSION_KEY);
      if (!seen) {
        setShowHint(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  function handleOpen() {
    try {
      sessionStorage.setItem(PALETTE_HINT_SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setShowHint(false);
    onOpen();
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      disabled={disabled}
      aria-label="Choose accent color"
      aria-expanded={open}
      aria-haspopup="dialog"
      title="Accent color"
      className={cn(
        "vs-palette-tab no-print fixed right-0 top-[42%] z-50 flex -translate-y-1/2 flex-col items-center justify-center gap-0.5",
        "h-11 w-10 rounded-l-lg border border-r-0 border-l-2 sm:h-12 sm:w-11 sm:rounded-l-xl sm:border-l-[3px] md:h-14 md:w-12 lg:h-16 lg:w-14",
        "border-primary/30 border-l-primary bg-card text-primary",
        "backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-200",
        "hover:border-primary/45 hover:bg-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "motion-reduce:transition-none",
        showHint && !open && "vs-palette-tab-hint",
        open && "border-primary/55 bg-primary/10",
        className,
      )}
    >
      <Palette
        className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5 lg:h-6 lg:w-6"
        strokeWidth={2.25}
        aria-hidden
      />
      <span className="hidden text-[7px] font-bold uppercase leading-none tracking-[0.12em] text-primary/80 sm:inline sm:text-[8px] lg:text-[9px]">
        Accent
      </span>
    </button>
  );
}
