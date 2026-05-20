import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { parseResumeWarnings } from "@/lib/resume-warning-links";

type ResumeWarningsBannerProps = {
  warnings: string[];
};

export function ResumeWarningsBanner({ warnings }: ResumeWarningsBannerProps) {
  if (warnings.length === 0) {
    return null;
  }

  const links = parseResumeWarnings(warnings);

  return (
    <div
      className="rounded-lg border border-warning/30 bg-warning/10 p-4 sm:p-5"
      role="status"
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Profile gaps detected
            </p>
            <p className="text-sm text-muted-foreground">
              Your resume was still created. Open the pages below to add missing
              data and improve your next version:
            </p>
          </div>
          <ul className="space-y-2">
            {links.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {item.label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
