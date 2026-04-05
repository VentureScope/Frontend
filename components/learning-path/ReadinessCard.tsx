// components/learning-path/ReadinessCard.tsx
export default function ReadinessCard() {
  return (
    <div className="flex items-center gap-6 rounded-[24px] bg-white p-6 shadow-sm border border-slate-50">
      {/* Circular Progress */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="transparent"
            stroke="#1d59db"
            strokeWidth="6"
            strokeDasharray="213.6"
            strokeDashoffset="53.4"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-lg font-black text-slate-900">75%</span>
      </div>

      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Current Readiness
        </p>
        <h4 className="text-2xl font-black text-[#1d59db] tracking-tight">
          Senior Rank
        </h4>
      </div>
    </div>
  );
}
