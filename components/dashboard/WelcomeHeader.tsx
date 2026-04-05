// components/dashboard/WelcomeHeader.tsx
export default function WelcomeHeader() {
  return (
    <div className="flex flex-col h-full justify-center gap-6">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Welcome back, Alex
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-slate-500">
          Your career trajectory is currently outperforming 82% of peers in your
          sector. Let's keep the momentum.
        </p>
      </div>

      {/* Readiness Score Badge */}
      <div className="flex h-32 w-32 flex-col items-center justify-center rounded-[32px] bg-blue-50 text-center">
        <span className="text-5xl font-bold text-blue-600">84</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
          Readiness Score
        </span>
      </div>
    </div>
  );
}
