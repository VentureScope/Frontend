"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  variant?: "icon" | "pill";
};

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", className)}
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border bg-muted/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted",
          className,
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <>
            <Sun className="h-3.5 w-3.5 text-primary" />
            Light
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5 text-primary" />
            Dark
          </>
        )}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted",
        className,
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] text-primary" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </Button>
  );
}
