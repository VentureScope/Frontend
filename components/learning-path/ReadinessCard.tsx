// components/learning-path/ReadinessCard.tsx
export default function ReadinessCard() {
  return (
    <div className="flex items-center gap-4 sm:gap-6 rounded-2xl md:rounded-[24px] bg-white p-4 sm:p-6 shadow-sm border border-slate-50">
      {/* Circular Progress */}
      <div className="relative flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center shrink-0">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="10%"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="transparent"
            stroke="#1d59db"
            strokeWidth="10%"
            strokeDasharray="251"
            strokeDashoffset="62.7"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm sm:text-lg font-black text-slate-900">
          75%
        </span>
      </div>

      <div className="space-y-0.5">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Current Readiness
        </p>
        <h4 className="text-xl sm:text-2xl font-black text-[#1d59db] tracking-tight">
          Senior Rank
        </h4>
      </div>
    </div>
  );
}
