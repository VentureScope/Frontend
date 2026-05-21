"use client";

import { X } from "lucide-react";
type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function AdminDrawer({ open, title, onClose, children }: Props) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        role="presentation"
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-xl transition-transform duration-200 sm:w-[400px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </>
  );
}
