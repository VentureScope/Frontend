// components/dashboard/MarketTrendsCard.tsx
export default function MarketTrendsCard() {
  const bars = [25, 60, 45, 75, 55, 90, 70];

  return (
    <div className="rounded-3xl sm:rounded-[40px] border border-slate-100 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Market Trends
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Full-Stack Dev Demand:{" "}
            <span className="text-emerald-500 font-bold">+12% this month</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase">
            React
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase">
            Node.js
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 sm:gap-4 h-32 sm:h-48">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-full rounded-lg sm:rounded-xl bg-blue-600 transition-all hover:bg-blue-700"
            style={{ height: `${h}%`, opacity: h < 60 ? 0.3 : 1 }}
          />
        ))}
      </div>
    </div>
  );
}
