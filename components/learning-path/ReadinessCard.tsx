export default function ReadinessCard() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:gap-6 sm:rounded-xl sm:p-6">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center sm:h-20 sm:w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            className="text-muted"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="10"
            strokeDasharray="251"
            strokeDashoffset="62.7"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm font-semibold text-foreground sm:text-lg">
          75%
        </span>
      </div>

      <div className="space-y-0.5">
        <p className="text-label text-muted-foreground">Current Readiness</p>
        <h4 className="text-xl font-semibold text-primary sm:text-2xl">
          Senior Rank
        </h4>
      </div>
    </div>
  );
}
