import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { InsightCardSkeleton } from "@/components/dashboard/DashboardSkeletons";
import type { UserReadiness } from "@/types/readiness";

export default function InsightCard({
  headline,
  loading,
  readiness,
  className,
}: {
  headline: string;
  loading?: boolean;
  readiness?: UserReadiness | null;
  className?: string;
}) {
  if (loading) {
    return <InsightCardSkeleton className={className} />;
  }

  return (
    <div
      className={`vs-surface-accent flex h-full min-h-0 flex-col p-6 sm:p-8 ${className ?? ""}`}
    >
      <span className="vs-badge vs-badge-success inline-flex w-fit items-center gap-1">
        <Sparkles className="h-3 w-3 shrink-0" /> AI Insight
      </span>

      <div className="flex flex-1 flex-col justify-center py-4 sm:py-6">
        <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
          {headline}
        </p>
        {readiness && readiness.missing_skills[0] && (
          <p className="mt-3 text-sm text-muted-foreground">
            Priority skill:{" "}
            <span className="font-semibold text-foreground">
              {readiness.missing_skills[0]}
            </span>
          </p>
        )}
      </div>

      <Link
        href={readiness ? "/dashboard/profile" : "/dashboard/learning-path"}
        className="text-btn flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        {readiness ? "Full breakdown" : "Analyze gaps"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
