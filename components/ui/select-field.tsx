"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type SelectFieldOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectFieldOption[];
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
  className?: string;
  listClassName?: string;
};

export function SelectField({
  id: idProp,
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select…",
  hint,
  className,
  listClassName,
}: SelectFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const listboxId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function selectOption(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative space-y-2", className)}>
      <Label id={`${id}-label`} htmlFor={id}>
        {label}
      </Label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        aria-controls={listboxId}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-left text-sm text-foreground shadow-xs transition-colors",
          "hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          open && "border-ring ring-3 ring-ring/50",
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className={cn(
            "absolute z-[10001] mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-lg scrollbar-none",
            listClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => selectOption(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <Check className="h-4 w-4 shrink-0" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
