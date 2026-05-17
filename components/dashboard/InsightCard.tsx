import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InsightCard() {
  return (
    <div className="vs-surface-accent flex min-h-75 flex-col justify-between p-6 sm:p-8 lg:min-h-0 lg:p-10">
      <div className="space-y-4 sm:space-y-5">
        <span className="vs-badge vs-badge-success inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 shrink-0" /> AI Insight
        </span>
        <h2 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          Your skill alignment for Senior DevOps roles is 92%. Check the gaps
          now.
        </h2>
      </div>

      <Link
        href="/dashboard/learning-path"
        className="text-btn mt-8 flex w-fit items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80 lg:mt-0"
      >
        Analyze Gaps <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
