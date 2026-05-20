import { Lightbulb, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SuggestedActionsSkeleton } from "@/components/dashboard/DashboardSkeletons";
import type { DashboardSuggestedAction } from "@/hooks/useDashboardOverview";
import { cn } from "@/lib/utils";

const ICONS = [Lightbulb, Zap, Lightbulb];

export default function SuggestedActions({
  actions,
  loading,
}: {
  actions: DashboardSuggestedAction[];
  loading?: boolean;
}) {
  if (loading) {
    return <SuggestedActionsSkeleton />;
  }

  return (
    <div className="vs-surface-accent flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
      <div className="space-y-6 sm:space-y-10">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Suggested actions
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {actions.map((action, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Link
                key={action.id}
                href={action.href}
                className={cn(
                  "block w-full rounded-md border border-border bg-card p-5 text-left transition-colors hover:border-primary/20 hover:bg-primary/5 sm:p-6 lg:p-8",
                )}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="vs-icon-tile vs-icon-tile-primary flex h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <h4 className="text-body font-medium leading-tight text-foreground">
                      {action.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <Link
        href="/dashboard/learning-path"
        className="text-btn mt-8 flex items-center gap-2 font-medium text-primary transition-all hover:gap-3 sm:mt-10"
      >
        Your learning paths <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
