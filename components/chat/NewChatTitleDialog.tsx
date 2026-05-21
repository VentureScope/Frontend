"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeChatTitle } from "@/lib/chat-utils";

type NewChatTitleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (title: string) => void | Promise<void>;
  isSubmitting?: boolean;
  description?: string;
  defaultValue?: string;
};

export function NewChatTitleDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
  description = "Give this conversation a name so you can find it later in your history.",
  defaultValue = "",
}: NewChatTitleDialogProps) {
  const titleId = useId();
  const [title, setTitle] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(defaultValue);
      setError(null);
    }
  }, [open, defaultValue]);

  function handleClose() {
    if (isSubmitting) return;
    onOpenChange(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = normalizeChatTitle(title, "");
    if (!normalized) {
      setError("Enter a title for this conversation.");
      return;
    }
    setError(null);
    await onConfirm(normalized);
  }

  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-foreground">
                Name your conversation
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor={`${titleId}-input`} className="text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              id={`${titleId}-input`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Resume feedback, DevOps roadmap"
              maxLength={255}
              autoFocus
              disabled={isSubmitting}
              className="h-11"
            />
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Max 255 characters.</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Start conversation"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
