"use client";

import { ArrowUp } from "lucide-react";
import { CHAT_MAIN_PADDING } from "@/components/chat/chat-layout";

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: React.ReactNode;
};

export function ChatComposer({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder = "Message…",
  disabled = false,
  hint,
}: ChatComposerProps) {
  return (
    <footer
      className={`shrink-0 border-t border-border bg-card/95 py-4 backdrop-blur-sm ${CHAT_MAIN_PADDING}`}
    >
      <div className="w-full">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/30 p-1.5 shadow-sm transition-[border-color,box-shadow] focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            rows={1}
            placeholder={placeholder}
            className="max-h-36 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-35"
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        {hint ? (
          <p className="mt-2 text-[11px] text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
