"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandSearchItem = {
  label: string;
  path: string;
  group?: string;
};

type CommandSearchProps = {
  items: CommandSearchItem[];
  placeholder?: string;
  className?: string;
};

function getShortcutLabel() {
  if (typeof navigator === "undefined") return "Ctrl+K";
  return /Mac|iPhone|iPad/i.test(navigator.platform) ? "⌘K" : "Ctrl+K";
}

function normalizeKey(event: KeyboardEvent): string {
  if (event.key) return event.key.toLowerCase();
  const code = event.code?.toLowerCase() ?? "";
  if (code === "keyk") return "k";
  if (code === "escape") return "escape";
  return "";
}

function SearchShortcutBadge({ label }: { label: string }) {
  return (
    <kbd
      className="pointer-events-none hidden h-5 shrink-0 select-none items-center rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground min-[480px]:inline-flex"
      aria-hidden
    >
      {label}
    </kbd>
  );
}

export function CommandSearch({
  items,
  placeholder = "Search…",
  className,
}: CommandSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl+K");

  useEffect(() => {
    setShortcutLabel(getShortcutLabel());
  }, []);

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items.slice(0, 8);
    return items
      .filter((item) =>
        `${item.label} ${item.path} ${item.group ?? ""}`
          .toLowerCase()
          .includes(trimmed),
      )
      .slice(0, 8);
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, matches.length]);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(0);
    inputRef.current?.blur();
  }, []);

  const handleSelect = useCallback(
    (path: string) => {
      closeSearch();
      setQuery("");
      router.push(path);
    },
    [closeSearch, router],
  );

  useEffect(() => {
    function onDocumentKeyDown(event: KeyboardEvent) {
      const key = normalizeKey(event);
      if (!key) return;
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        setIsOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      if (key === "escape" && isOpen) {
        event.preventDefault();
        closeSearch();
      }
    }

    document.addEventListener("keydown", onDocumentKeyDown);
    return () => document.removeEventListener("keydown", onDocumentKeyDown);
  }, [closeSearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeSearch();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeSearch, isOpen]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (matches.length === 0) return;
      setActiveIndex((i) => (i + 1) % matches.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (matches.length === 0) return;
      setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
      return;
    }
    if (event.key === "Enter" && matches[activeIndex]) {
      event.preventDefault();
      handleSelect(matches[activeIndex].path);
    }
  }

  const showPanel = isOpen;
  const activeOptionId =
    showPanel && matches.length > 0
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  const resultButtonClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
      active
        ? "bg-primary/10 text-foreground"
        : "text-foreground hover:bg-muted",
    );

  return (
    <div
      ref={containerRef}
      className={cn("relative min-w-0 w-full", className)}
    >
      <div className="flex h-9 w-full items-center gap-2 overflow-hidden rounded-lg border border-border bg-background/90 px-2.5 shadow-sm transition-[box-shadow,border-color] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
        <Search
          className="h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          {...(showPanel ? { "aria-controls": listboxId } : {})}
          {...(activeOptionId ? { "aria-activedescendant": activeOptionId } : {})}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onInputKeyDown}
          className="min-h-0 min-w-0 flex-1 overflow-hidden bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <SearchShortcutBadge label={shortcutLabel} />
        )}
      </div>

      {showPanel && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl"
          onMouseDown={(event) => event.preventDefault()}
        >
          {matches.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query.trim()}&rdquo;
            </p>
          ) : (
            <ul className="py-1">
              {matches.map((item, index) => (
                <li key={item.path} role="presentation">
                  <button
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleSelect(item.path)}
                    className={resultButtonClass(index === activeIndex)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {item.label}
                      </span>
                      {item.group ? (
                        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                          {item.group}
                        </span>
                      ) : null}
                    </span>
                    <span className="hidden shrink-0 truncate font-mono text-[10px] text-muted-foreground/80 min-[480px]:inline">
                      {item.path
                        .replace(/^\/dashboard\/?/, "/")
                        .replace(/^\/admin\/?/, "/") || "/"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="hidden flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-3 py-2 text-[10px] text-muted-foreground min-[480px]:flex">
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              select
            </span>
            <span>
              <kbd className="rounded border border-border/80 bg-muted/50 px-1 font-mono">
                esc
              </kbd>{" "}
              close
            </span>
            <span className="ml-auto font-mono">{shortcutLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
