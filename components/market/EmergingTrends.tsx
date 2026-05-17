import { Sparkles, Rocket, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergingTrends() {
  return (
    <div className="vs-band rounded-lg p-6 sm:rounded-xl sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-label text-primary sm:mb-8">
        <Sparkles className="h-4 w-4 shrink-0" /> Emerging Trends
      </div>

      <div className="mb-8 space-y-6 sm:mb-10 sm:space-y-8">
        <div className="flex gap-4">
          <div className="vs-icon-tile vs-icon-tile-primary flex h-10 w-10 shrink-0 rounded-md">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold sm:text-base">FinTech Scalability</h4>
            <p className="vs-band-muted mt-1 text-xs leading-relaxed">
              Surge in digital wallet integration skills in Addis Ababa.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="vs-icon-tile vs-icon-tile-accent flex h-10 w-10 shrink-0 rounded-md">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold sm:text-base">Cloud Migration</h4>
            <p className="vs-band-muted mt-1 text-xs leading-relaxed">
              Azure and AWS certifications are currently +40% year-on-year.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-md border-inverse-foreground/25 bg-inverse-foreground/10 font-semibold text-inverse-foreground hover:bg-inverse-foreground/15 sm:h-14"
      >
        Download Detailed Report
      </Button>
    </div>
  );
}
