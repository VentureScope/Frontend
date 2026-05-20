import { AlertTriangle } from "lucide-react";

type ResumeWarningsBannerProps = {
  warnings: string[];
};

export function ResumeWarningsBanner({ warnings }: ResumeWarningsBannerProps) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-lg border border-warning/30 bg-warning/10 p-4 sm:p-5"
      role="status"
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            Profile gaps detected
          </p>
          <p className="text-sm text-muted-foreground">
            Your resume was still created. Add data in Data Hub to improve
            these sections:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
