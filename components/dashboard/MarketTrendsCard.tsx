const BAR_COLORS = [
  "bg-chart-1/90",
  "bg-chart-1/70",
  "bg-chart-4/80",
  "bg-chart-1",
  "bg-chart-3/80",
  "bg-chart-2/70",
  "bg-chart-4",
];

export default function MarketTrendsCard() {
  const bars = [25, 60, 45, 75, 55, 90, 70];

  return (
    <div className="vs-surface p-6 sm:p-8 lg:p-10">
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
            <span key={tag} className="vs-accent-chip text-label rounded-md px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex h-32 items-end justify-between gap-2 sm:h-48 sm:gap-4">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`w-full rounded-md transition-all hover:opacity-90 ${BAR_COLORS[i % BAR_COLORS.length]}`}
            style={{ height: `${h}%`, opacity: h < 60 ? 0.45 : 1 }}
          />
        ))}
      </div>
    </div>
  );
}
