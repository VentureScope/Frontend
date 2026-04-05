// components/market/IntelligenceLayerSummary.tsx
export default function IntelligenceLayerSummary() {
  return (
    <div className="group relative overflow-hidden rounded-[32px] bg-[#0f172a] p-10 text-white shadow-2xl shadow-blue-900/40">
      {/* Visual Background - Abstract Mesh/Network */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
          alt="Tech Mesh"
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

      {/* Radial Glow for Depth */}
      <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-blue-600/30 blur-[80px]" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
            Intelligence Layer
          </p>
        </div>

        <p className="text-xl font-bold leading-relaxed tracking-tight text-white/90">
          Forecasting model <span className="text-blue-400">FR5.5</span>{" "}
          estimates a{" "}
          <span className="underline decoration-blue-500/50 underline-offset-4">
            22% increase
          </span>{" "}
          in remote-friendly roles by Q4.
        </p>

        <div className="pt-4">
          <div className="h-1 w-12 rounded-full bg-blue-500/50" />
        </div>
      </div>
    </div>
  );
}
