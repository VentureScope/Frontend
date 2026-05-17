export default function MarketTrendsCard() {
  const bars = [25, 60, 45, 75, 55, 90, 70];

  return (
    <div className="vs-surface p-6 sm:p-8 sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Market Trends
          </h2>
          <p className="text-body text-muted-foreground">
            Full-Stack Dev Demand:{" "}
            <span className="font-semibold text-success">+12% this month</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["React", "Node.js"].map((tag) => (
            <span
              key={tag}
              className="text-label rounded-lg bg-muted px-3 py-1 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex h-32 items-end justify-between gap-2 sm:h-48 sm:gap-4">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-full rounded-lg bg-primary transition-all hover:bg-primary/90 sm:rounded-xl"
            style={{ height: `${h}%`, opacity: h < 60 ? 0.35 : 1 }}
          />
        ))}
      </div>
    </div>
  );
}
