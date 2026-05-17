export default function ScoreCard() {
  return (
    <div className="vs-surface flex items-center justify-between p-6">
      <div>
        <p className="text-label text-muted-foreground">Current standing</p>
        <h2 className="mt-1 text-2xl font-semibold text-foreground">
          Job-ready for Backend Engineer
        </h2>
        <p className="mt-2 font-medium text-foreground">82 / 100</p>
        <button
          type="button"
          className="text-btn mt-4 rounded-md border border-border bg-muted px-4 py-2 text-foreground transition-colors hover:bg-muted/80"
        >
          View Career Roadmap
        </button>
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-md border border-border bg-muted text-lg font-semibold text-foreground">
        82
      </div>
    </div>
  );
}

