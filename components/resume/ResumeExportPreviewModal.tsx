"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import ResumePreview from "@/components/resume/ResumePreview";
import { Button } from "@/components/ui/button";
import { downloadResumePdf, resumePdfFilename } from "@/lib/resume-pdf-export";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";

type ResumeExportPreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: Resume | null;
};

export function ResumeExportPreviewModal({
  open,
  onOpenChange,
  resume,
}: ResumeExportPreviewModalProps) {
  const titleId = useId();
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleDownload() {
    if (!previewRef.current || !resume) {
      return;
    }
    setExporting(true);
    try {
      await downloadResumePdf(
        previewRef.current,
        resumePdfFilename(resume.title),
      );
      toast.success("PDF downloaded");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Could not generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  function handleClose() {
    if (exporting) {
      return;
    }
    onOpenChange(false);
  }

  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/55 backdrop-blur-sm"
      role="presentation"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-labelledby={titleId}
        aria-modal="true"
        className="mx-auto flex h-full w-full max-w-5xl flex-col p-3 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex shrink-0 flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-foreground">
              CV preview
            </h2>
            <p className="text-sm text-muted-foreground">
              Review your résumé, then download a clean PDF without editor
              controls.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={exporting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-2"
              disabled={exporting || !resume}
              onClick={() => void handleDownload()}
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download PDF
            </Button>
            <button
              type="button"
              onClick={handleClose}
              disabled={exporting}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-muted/70 p-4 sm:p-10">
          <div
            ref={previewRef}
            className="resume-pdf-export mx-auto w-fit max-w-full"
          >
            {resume ? (
              <ResumePreview
                resume={resume}
                hideActions
                forExport
                className="shadow-2xl ring-1 ring-border/40"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
