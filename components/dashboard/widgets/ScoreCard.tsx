export default function ScoreCard() {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent p-6 rounded-2xl shadow-sm flex justify-between items-center border border-border">

      <div>
        <p className="text-sm text-muted-foreground">Current Standing</p>

        <h2 className="text-2xl font-semibold mt-1">
          Job-ready for Backend Engineer
        </h2>

        <p className="text-primary font-medium mt-2">
          82 / 100
        </p>

        <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm">
          View Career Roadmap
        </button>
      </div>

      {/* SCORE CIRCLE (simple version) */}
      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
        82
      </div>

    </div>
  );
}