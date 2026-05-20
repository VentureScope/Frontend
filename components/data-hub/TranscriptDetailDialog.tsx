"use client";

import { X } from "lucide-react";
import type { TranscriptResponse } from "@/types/transcript";
import { formatHubTimestamp } from "@/lib/data-hub-utils";

type TranscriptDetailDialogProps = {
  transcript: TranscriptResponse;
  gpaScale?: number;
  onClose: () => void;
};

export default function TranscriptDetailDialog({
  transcript,
  gpaScale = 4,
  onClose,
}: TranscriptDetailDialogProps) {
  const semesters = transcript.transcript_data?.semesters ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transcript-dialog-title"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="transcript-dialog-title"
              className="text-lg font-bold text-foreground"
            >
              Transcript v{transcript.version}
            </h2>
            <p className="text-xs text-muted-foreground">
              Uploaded {formatHubTimestamp(transcript.uploaded_at)} · scale /{" "}
              {gpaScale.toFixed(1)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-4rem)] overflow-y-auto p-5 space-y-8">
          {semesters.map((sem) => (
            <section key={`${sem.academic_year}-${sem.semester}`}>
              <h3 className="text-sm font-bold text-foreground">
                {sem.semester} · {sem.academic_year}
                {sem.year_level ? ` · ${sem.year_level}` : ""}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                SGPA {sem.semester_summary.sgpa.toFixed(2)} · CGPA{" "}
                {sem.cumulative_summary.cgpa.toFixed(2)} ·{" "}
                {sem.cumulative_summary.credit_hours} credits
              </p>
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-2">Code</th>
                    <th className="py-2 pr-2">Course</th>
                    <th className="py-2 pr-2">Cr</th>
                    <th className="py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.courses.map((course) => (
                    <tr
                      key={`${course.code}-${course.title}`}
                      className="border-b border-border/50"
                    >
                      <td className="py-2 pr-2 font-mono text-xs">
                        {course.code}
                      </td>
                      <td className="py-2 pr-2 text-foreground">
                        {course.title}
                      </td>
                      <td className="py-2 pr-2 text-muted-foreground">
                        {course.credit_hours}
                      </td>
                      <td className="py-2 font-semibold">{course.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
