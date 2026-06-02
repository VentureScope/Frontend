"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { MlStatusLabel } from "@/components/admin/ui/admin-status";
import type { MlRunRow } from "@/types/admin-ml";

type MlRunSummaryModalProps = {
  /** All models in the bundle (prophet + lstm). */
  bundle: MlRunRow[] | null;
  /** Display label for the bundle (base run ID). */
  bundleLabel?: string | null;
  open: boolean;
  onClose: () => void;
};

function RunDetailSections({ run }: { run: MlRunRow }) {
  return (
    <div className="space-y-5">
      {run.metrics_summary ? (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
          {run.metrics_summary}
        </p>
      ) : null}

      {run.detail.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No detailed metrics available for this model.
        </p>
      ) : null}

      {run.detail.map((section) => (
        <section key={section.title}>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
            {section.title}
          </h3>
          <dl className="divide-y divide-border rounded-md border border-border">
            {section.fields.map((item) => (
              <div
                key={`${section.title}-${item.label}`}
                className="grid grid-cols-[minmax(7rem,38%)_1fr] gap-3 px-3 py-2.5 text-sm"
              >
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="break-all font-mono text-xs text-foreground sm:text-sm">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

export function MlRunSummaryModal({
  bundle,
  bundleLabel,
  open,
  onClose,
}: MlRunSummaryModalProps) {
  const [activeModel, setActiveModel] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Default the active tab to the first model whenever the bundle changes.
  useEffect(() => {
    if (bundle && bundle.length > 0) {
      setActiveModel(bundle[0].model_type);
    }
  }, [bundle]);

  if (!open || !bundle || bundle.length === 0 || typeof window === "undefined") {
    return null;
  }

  const activeRun =
    bundle.find((r) => r.model_type === activeModel) ?? bundle[0];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="ml-run-summary-title"
        aria-modal="true"
        className="flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 space-y-1">
            <h2
              id="ml-run-summary-title"
              className="text-lg font-semibold text-foreground"
            >
              Bundle summary
            </h2>
            {bundleLabel ? (
              <p className="truncate font-mono text-xs text-muted-foreground">
                {bundleLabel}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">
                {bundle.length} model{bundle.length !== 1 ? "s" : ""} trained together
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Model tabs */}
        <div className="flex gap-1 border-b border-border px-5 pt-3">
          {bundle.map((run) => {
            const isActive = run.model_type === activeRun.model_type;
            return (
              <button
                key={run.id}
                type="button"
                onClick={() => setActiveModel(run.model_type)}
                className={`flex items-center gap-2 rounded-t-md border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-mono">{run.model_type}</span>
                <MlStatusLabel status={run.status} />
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <RunDetailSections run={activeRun} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
