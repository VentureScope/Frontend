import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AICallout() {
  return (
    <div className="vs-band relative overflow-hidden rounded-lg px-4 py-7 sm:rounded-xl sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute top-1/2 right-6 hidden -translate-y-1/2 opacity-20 lg:right-12 lg:block">
        <div className="relative h-48 w-48">
          <Sparkles
            className="absolute top-0 right-0 h-32 w-32"
            strokeWidth={1}
          />
          <Sparkles
            className="absolute bottom-4 left-0 h-16 w-16"
            strokeWidth={1}
          />
          <Sparkles
            className="absolute right-10 bottom-0 h-10 w-10"
            strokeWidth={1}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl space-y-5 sm:space-y-6 lg:space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          Bridge the AI Literacy Gap
        </h2>
        <p className="text-body vs-band-muted leading-relaxed sm:text-base lg:text-lg">
          Our intelligence layer has identified that your current profile is a
          85% match for &apos;Head of Strategy&apos; roles. Adding{" "}
          <span className="font-semibold text-primary underline decoration-primary/40 underline-offset-4">
            LLM Orchestration
          </span>{" "}
          knowledge could elevate you to the top 5% of candidates.
        </p>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <Button
            asChild
            className="h-12 w-full rounded-xl bg-primary px-6 text-primary-foreground  hover:bg-primary/90 sm:h-14 sm:w-auto sm:px-10"
          >
            <Link href="/dashboard/ai-advisor">Start Assessment</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-md border-inverse-foreground/25 bg-inverse-foreground/10 px-6 text-inverse-foreground hover:bg-inverse-foreground/15 sm:h-14 sm:w-auto sm:px-10"
          >
            <Link href="/dashboard/learning-path">View Learning Path</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
