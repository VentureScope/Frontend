// components/market/EmergingTrends.tsx
import { Sparkles, Rocket, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergingTrends() {
  return (
    <div className="rounded-[32px] bg-[#0f172a] p-8 text-white shadow-xl">
      <div className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
        <Sparkles size={14} className="fill-blue-400" /> Emerging Trends
      </div>

      <div className="space-y-8 mb-10">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <Rocket size={20} />
          </div>
          <div>
            <h4 className="font-bold">FinTech Scalability</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Surge in digital wallet integration skills in Addis Ababa.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <Cloud size={20} />
          </div>
          <div>
            <h4 className="font-bold">Cloud Migration</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Azure and AWS certifications are currently +40% year-on-year.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-14 w-full rounded-2xl border-transparent cursor-pointer bg-white font-bold hover:bg-slate-100"
        style={{ color: "#0f172a" }}
      >
        Download Detailed Report
      </Button>
    </div>
  );
}
