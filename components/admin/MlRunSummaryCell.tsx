"use client";

import type { MlRunRow } from "@/types/admin-ml";
import { adminGhostBtn } from "@/components/admin/ui/admin-styles";

type MlRunSummaryCellProps = {
  run: MlRunRow;
  onView: () => void;
};

export function MlRunSummaryCell({ run, onView }: MlRunSummaryCellProps) {
  if (!run.has_summary) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <button
      type="button"
      onClick={onView}
      className={`${adminGhostBtn} text-xs font-semibold text-primary`}
      title={run.metrics_summary ?? "View run summary"}
    >
      View
    </button>
  );
}
