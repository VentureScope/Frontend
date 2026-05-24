export default function IntelligenceLayerSummary({
  insight,
}: {
  insight?: string | null;
}) {
  return (
    <div className="vs-band group relative overflow-hidden rounded-lg p-6 sm:rounded-xl sm:p-10">
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
          alt="Tech Mesh"
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

      <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-lg bg-primary/25 blur-[80px]" />

      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
          <p className="text-label text-primary">Intelligence Layer</p>
        </div>

        <p className="text-lg font-bold leading-relaxed tracking-tight sm:text-xl">
          {insight ??
            "Ensemble forecasts blend Prophet and LSTM signals to project role-level hiring demand."}
        </p>

        <div className="pt-2 sm:pt-4">
          <div className="h-1 w-12 rounded-md bg-primary/70" />
        </div>
      </div>
    </div>
  );
}
