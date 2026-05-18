import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoadmapInfoCallout({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "vs-surface-accent mb-8 flex gap-4 rounded-md border border-border p-4 sm:p-5",
        className,
      )}
    >
      <div className="vs-icon-tile-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}
