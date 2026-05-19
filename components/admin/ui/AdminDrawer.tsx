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
        className="fixed inset-0 z-40 bg-black/50"
        role="presentation"
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-[400px] flex-col border-l border-zinc-800 bg-zinc-900 transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <h2 className="text-sm font-medium text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white"
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
