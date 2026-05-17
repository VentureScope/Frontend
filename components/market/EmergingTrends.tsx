// components/market/EmergingTrends.tsx
import { Sparkles, Rocket, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergingTrends() {
  return (
    <div className="rounded-lg bg-foreground p-6 text-background shadow-xl sm:rounded-xl sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-label text-accent sm:mb-8">
        <Sparkles className="h-4 w-4 shrink-0 fill-accent" /> Emerging Trends
      </div>

      <div className="mb-8 space-y-6 sm:mb-10 sm:space-y-8">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/10 text-background">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold sm:text-base">
              FinTech Scalability
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-background/70">
              Surge in digital wallet integration skills in Addis Ababa.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/10 text-background">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold sm:text-base">Cloud Migration</h4>
            <p className="mt-1 text-xs leading-relaxed text-background/70">
              Azure and AWS certifications are currently +40% year-on-year.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-lg border-background/20 bg-background font-bold text-foreground hover:bg-muted sm:h-14"
      >
        Download Detailed Report
      </Button>
    </div>
  );
}
