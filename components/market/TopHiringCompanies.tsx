export default function TopHiringCompanies() {
  const companies = [
    {
      name: "Safaricom Ethiopia",
      cat: "Telecommunications",
      count: 342,
      init: "S",
      bg: "bg-blue-50 text-blue-600",
    },
    {
      name: "Ethio Telecom",
      cat: "Infrastructure",
      count: 218,
      init: "E",
      bg: "bg-blue-50 text-blue-600",
    },
    {
      name: "CBE Tech Hub",
      cat: "FinTech",
      count: 156,
      init: "C",
      bg: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#0f172a]">
          Top Hiring Companies
        </h3>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right leading-none shrink-0">
          Ethiopia
          <br />
          Market
        </span>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {companies.map((c) => (
          <div key={c.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${c.bg}`}
              >
                {c.init}
              </div>
              <div className="min-w-0 pr-2">
                <p className="font-bold text-sm sm:text-base text-slate-900 leading-tight sm:leading-none mb-0.5 sm:mb-1 truncate">
                  {c.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400 truncate">
                  {c.cat}
                </p>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 shrink-0">
              {c.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
