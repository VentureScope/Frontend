"use client";

import { Menu, X } from "lucide-react";

type ChatPageShellProps = {
  toggleId: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/** Full-height chat layout: narrow left rail + main conversation */
export function ChatPageShell({
  toggleId,
  sidebar,
  children,
  className,
}: ChatPageShellProps) {
  return (
    <div
      className={`relative flex h-[calc(100dvh-5rem)] overflow-hidden bg-background lg:h-[calc(100dvh-9rem)] ${className ?? ""}`}
    >
      <input type="checkbox" id={toggleId} className="peer hidden" />

      <label
        htmlFor={toggleId}
        className="absolute left-4 top-4 z-50 flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm hover:text-foreground lg:hidden"
      >
        <Menu className="h-4 w-4" />
        Chats
      </label>

      <label
        htmlFor={toggleId}
        className="absolute inset-0 z-30 hidden bg-black/30 backdrop-blur-[2px] peer-checked:block lg:hidden"
        aria-hidden
      />

      <aside className="absolute left-0 z-40 flex h-full w-[min(100%,280px)] -translate-x-full flex-col border-r border-border bg-card transition-transform duration-300 ease-out peer-checked:translate-x-0 sm:w-72 lg:relative lg:z-0 lg:translate-x-0">
        <label
          htmlFor={toggleId}
          className="flex cursor-pointer items-center gap-2 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground lg:hidden"
        >
          <X className="h-4 w-4" />
          Close
        </label>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 scrollbar-none">
          {sidebar}
        </div>
      </aside>

      <section className="relative z-10 flex min-w-0 flex-1 flex-col bg-background pt-14 lg:pt-0">
        {children}
      </section>
    </div>
  );
}
