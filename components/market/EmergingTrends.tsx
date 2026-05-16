// components/market/EmergingTrends.tsx
import { Sparkles, Rocket, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergingTrends() {
  return (
    <div className="rounded-[28px] sm:rounded-[32px] bg-[#0f172a] p-6 sm:p-8 text-white shadow-xl">
      <div className="mb-6 sm:mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-accent)]">
        <Sparkles className="h-4 w-4 fill-[var(--brand-accent)] shrink-0" /> Emerging Trends
      </div>

      <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-white">
              FinTech Scalability
            </h4>
            <p className="mt-1 text-xs text-white/70 leading-relaxed">
              Surge in digital wallet integration skills in Addis Ababa.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-white">Cloud Migration</h4>
            <p className="mt-1 text-xs text-white/70 leading-relaxed">
              Azure and AWS certifications are currently +40% year-on-year.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-12 sm:h-14 w-full rounded-2xl border-white/20 bg-card text-card-foreground font-bold hover:bg-muted"
      >
        Download Detailed Report
      </Button>
    </div>
  );
}
