import Link from "next/link";
import { BarChart2, Rocket, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmergingTrendItem } from "@/lib/job-market-insights";

const ICONS = [
  { Icon: Rocket, className: "vs-icon-tile vs-icon-tile-primary" },
  { Icon: TrendingUp, className: "vs-icon-tile vs-icon-tile-accent" },
  { Icon: BarChart2, className: "vs-icon-tile vs-icon-tile-secondary" },
] as const;

export default function EmergingTrends({
  items,
  loading,
}: {
  items: EmergingTrendItem[];
  loading?: boolean;
}) {
  return (
    <div className="vs-band rounded-lg p-6 sm:rounded-xl sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-label text-primary sm:mb-8">
        <Sparkles className="h-4 w-4 shrink-0" /> Emerging Trends
      </div>

      <div className="mb-8 space-y-6 sm:mb-10 sm:space-y-8">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4">
              <div className="h-10 w-10 shrink-0 rounded-md bg-inverse-foreground/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-inverse-foreground/10" />
                <div className="h-3 w-full rounded bg-inverse-foreground/10" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <p className="text-xs leading-relaxed vs-band-muted">
            No emerging signals yet. Check back after the next market data
            refresh.
          </p>
        ) : (
          items.map((item, i) => {
            const { Icon, className } = ICONS[i % ICONS.length];
            return (
              <div key={item.id} className="flex gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${className}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold sm:text-base">
                    {item.title}
                  </h4>
                  <p className="vs-band-muted mt-1 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-md border-inverse-foreground/25 bg-inverse-foreground/10 font-semibold text-inverse-foreground hover:bg-inverse-foreground/15 sm:h-14"
        asChild
      >
        <Link href="/dashboard/learning-path/new-roadmap">
          Explore trending roles
        </Link>
      </Button>
    </div>
  );
}
