import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AICallout() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#0f172a] px-4 py-7 text-white sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {/* Decorative Star Graphics (matching the UI's right-side vector) */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 opacity-20 lg:right-12 lg:block">
        <div className="relative h-48 w-48">
          <Sparkles
            className="absolute right-0 top-0 h-32 w-32 text-slate-400"
            strokeWidth={1}
          />
          <Sparkles
            className="absolute bottom-4 left-0 h-16 w-16 text-slate-400"
            strokeWidth={1}
          />
          <Sparkles
            className="absolute bottom-0 right-10 h-10 w-10 text-slate-400"
            strokeWidth={1}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl space-y-5 sm:space-y-6 lg:space-y-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Bridge the AI Literacy Gap
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
          Our intelligence layer has identified that your current profile is a
          85% match for 'Head of Strategy' roles. Adding{" "}
          <span className="text-blue-400 font-bold underline underline-offset-8 decoration-blue-400/20">
            LLM Orchestration
          </span>{" "}
          knowledge could elevate you to the top 5% of candidates.
        </p>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <Button className="h-12 w-full rounded-2xl bg-[#1d59db] px-6 font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 sm:h-14 sm:w-auto sm:px-10">
            Start Assessment
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl border-slate-700 bg-white/5 px-6 font-bold text-white hover:bg-white/10 sm:h-14 sm:w-auto sm:px-10"
          >
            View Learning Path
          </Button>
        </div>
      </div>
    </div>
  );
}
