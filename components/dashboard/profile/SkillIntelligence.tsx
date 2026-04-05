const skills = [
  {
    label: "STRATEGIC PLANNING",
    status: "+2.4%",
    level: "Expert",
    pct: 94,
    color: "blue",
  },
  {
    label: "DATA VISUALIZATION",
    status: "Gap Found",
    level: "Advanced",
    pct: 72,
    color: "rose",
  },
  {
    label: "PRODUCT MARKETING",
    status: "Steady",
    level: "Intermediate",
    pct: 58,
    color: "indigo",
  },
  {
    label: "STAKEHOLDER MGMT",
    status: "Top 1%",
    level: "Elite",
    pct: 98,
    color: "emerald",
  },
];

export default function SkillIntelligence() {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Skill Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            Current proficiency vs. Industry benchmarks
          </p>
        </div>
        <button className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors">
          Add New Skill
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm border-l-4 ${
              s.color === "blue"
                ? "border-l-blue-600"
                : s.color === "rose"
                  ? "border-l-rose-500"
                  : s.color === "indigo"
                    ? "border-l-indigo-600"
                    : "border-l-emerald-500"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-[9px] font-bold text-slate-400 leading-tight tracking-wider max-w-17.5">
                {s.label}
              </span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                  s.status === "Gap Found"
                    ? "bg-rose-50 text-rose-500"
                    : s.status === "Steady"
                      ? "bg-slate-100 text-slate-500"
                      : "bg-emerald-50 text-emerald-500"
                }`}
              >
                {s.status}
              </span>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-8">
              {s.level}
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Proficiency</span>
                <span>{s.pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full ${
                    s.color === "blue"
                      ? "bg-blue-600"
                      : s.color === "rose"
                        ? "bg-rose-500"
                        : s.color === "indigo"
                          ? "bg-indigo-600"
                          : "bg-emerald-500"
                  }`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
