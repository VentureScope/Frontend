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
    <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-end justify-between">
        <h3 className="text-xl font-bold text-[#0f172a]">
          Top Hiring Companies
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right leading-none">
          Ethiopia
          <br />
          Market
        </span>
      </div>
      <div className="space-y-6">
        {companies.map((c) => (
          <div key={c.name} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${c.bg}`}
              >
                {c.init}
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-none mb-1">
                  {c.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  {c.cat}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
