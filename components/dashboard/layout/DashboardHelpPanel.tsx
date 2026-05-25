"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { DASHBOARD_HELP_SECTIONS } from "@/lib/legal-documents";
import { cn } from "@/lib/utils";

type DashboardHelpPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DashboardHelpPanel({
  open,
  onOpenChange,
}: DashboardHelpPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!panelRef.current) return;
      const target = event.target as Node;
      if (!panelRef.current.contains(target)) {
        onOpenChange(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "rounded-lg p-2 text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
        aria-label="Help and quick start guide"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <HelpCircle size={20} />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-card shadow-lg"
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Quick start guide
              </p>
              <p className="text-xs text-muted-foreground">
                Get the most from VentureScope
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close help"
            >
              <X size={16} />
            </button>
          </div>

          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Search className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p>
                Use the search bar in the header to jump to any page (learning
                path, resume, organizations, settings).
              </p>
            </div>
            <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p>
                The bell icon shows notifications for roadmaps, resumes, and team
                activity—click one to open the related page.
              </p>
            </div>
          </div>

          <ul className="max-h-[min(22rem,55vh)] divide-y divide-border overflow-y-auto">
            {DASHBOARD_HELP_SECTIONS.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    router.push(item.href);
                  }}
                  className="flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {item.title}
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-border px-4 py-3 text-center">
            <Link
              href="/about"
              className="text-xs font-semibold text-primary hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Learn more about VentureScope →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
