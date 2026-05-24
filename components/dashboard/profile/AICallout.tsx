import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { UserReadiness } from "@/types/readiness";
import { Skeleton } from "@/components/ui/skeleton";

export default function AICallout({
  readiness,
  loading,
}: {
  readiness?: UserReadiness | null;
  loading?: boolean;
}) {
  const hasAssessment = Boolean(readiness && readiness.overall_score > 0);

  return (
    <div className="vs-band relative overflow-hidden rounded-lg px-5 py-6 sm:rounded-xl sm:px-8 sm:py-8">
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-label text-primary">
            <Sparkles className="h-4 w-4 shrink-0" />
            Next steps
          </div>
          {loading ? (
            <Skeleton className="h-5 w-64 max-w-full bg-inverse-foreground/10" />
          ) : hasAssessment ? (
            <p className="text-sm leading-relaxed vs-band-muted sm:text-base">
              Use your readiness breakdown above, then build a learning path
              or explore roles that match your profile.
            </p>
          ) : (
            <p className="text-sm leading-relaxed vs-band-muted sm:text-base">
              Set career interests and skills, then refresh your readiness
              score to unlock personalized recommendations.
            </p>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            asChild
            className="h-11 w-full rounded-xl bg-primary px-5 text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            <Link href="/dashboard/learning-path/new-roadmap">
              Build learning path
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-md border-inverse-foreground/25 bg-inverse-foreground/10 px-5 text-inverse-foreground hover:bg-inverse-foreground/15 sm:w-auto"
          >
            <Link href="/dashboard/market-trends">Market trends</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
