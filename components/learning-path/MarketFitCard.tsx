export default function MarketFitCard() {
  return (
    <div className="w-full rounded-xl border border-border bg-foreground p-6 text-background shadow-2xl sm:p-8 lg:p-10">
      <p className="text-label mb-6 text-background/60 sm:mb-8">
        Market Fit Score
      </p>

      <div className="mb-6 flex items-baseline gap-1.5 sm:mb-8">
        <span className="text-6xl font-semibold leading-none tracking-tighter sm:text-7xl">
          84
        </span>
        <span className="text-xl font-medium text-background/60 sm:text-2xl">
          /100
        </span>
      </div>

      <p className="text-body mb-8 leading-relaxed text-background/70 sm:mb-10">
        Your skills are highly competitive for{" "}
        <span className="cursor-pointer font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:underline">
          Senior Data Scientist
        </span>{" "}
        roles in Fintech and Logistics.
      </p>

      <div className="mb-6 space-y-6 border-b border-background/20 pb-8 sm:mb-8 sm:space-y-9 sm:pb-10">
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-background/60">Technical Match</span>
            <span>92%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/20">
            <div className="h-full w-[92%] rounded-full bg-accent shadow-[0_0_12px] shadow-accent/30" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-background/60">Leadership Index</span>
            <span>68%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/20">
            <div className="h-full w-[68%] rounded-full bg-secondary shadow-[0_0_12px] shadow-secondary/30" />
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <p className="text-label text-background/60">Gaps Detected</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {["MLOps", "System Design"].map((gap) => (
            <span
              key={gap}
              className="rounded-full border border-secondary/30 bg-muted px-4 py-1.5 text-xs font-medium text-secondary sm:px-5 sm:py-2"
            >
              {gap}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
