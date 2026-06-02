import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function IntelligenceLayerSummary({
  insight,
  loading,
  topRole,
}: {
  insight?: string | null;
  loading?: boolean;
  topRole?: string;
}) {
  const roadmapHref = "/dashboard/learning-path/new-roadmap";

  return (
    <div className="vs-band group relative overflow-hidden rounded-lg p-6 sm:rounded-xl sm:p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/15 opacity-80" />
      <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-lg bg-primary/25 blur-[80px]" />

      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
          <p className="text-label text-primary">Intelligence Layer</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-full bg-inverse-foreground/10" />
            <Skeleton className="h-6 w-4/5 bg-inverse-foreground/10" />
          </div>
        ) : (
          <p className="text-lg font-bold leading-relaxed tracking-tight sm:text-xl">
            {insight ??
              "Ensemble forecasts project role-level hiring demand from indexed job listings."}
          </p>
        )}

        <Button
          variant="outline"
          className="h-11 gap-2 border-inverse-foreground/25 bg-inverse-foreground/10 font-semibold text-inverse-foreground hover:bg-inverse-foreground/15"
          asChild
        >
          <Link href={roadmapHref}>
            Build roadmap for {topRole ?? "a trending role"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <div className="pt-1 sm:pt-2">
          <div className="h-1 w-12 rounded-md bg-primary/70" />
        </div>
      </div>
    </div>
  );
}
