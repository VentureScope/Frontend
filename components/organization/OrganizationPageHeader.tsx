import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function OrganizationPageHeader({
  label,
  title,
  description,
  icon: Icon,
  actions,
  className,
}: {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 space-y-4 sm:mb-10", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="vs-icon-tile-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 space-y-2">
            <span className="text-label text-primary">{label}</span>
            <h1 className="text-h1 text-foreground">{title}</h1>
            <p className="text-body max-w-2xl text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
