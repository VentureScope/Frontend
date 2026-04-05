import { Progress } from "@/components/ui/progress";

const skills = [
  { name: "Go (Golang)", match: "89%", val: 89 },
  { name: "React / Next.js", match: "76%", val: 76 },
  { name: "System Design", match: "64%", val: 64 },
  { name: "Data Engineering", match: "52%", val: 52 },
];

export default function InDemandSkills() {
  return (
    <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
      <h3 className="mb-8 text-xl font-bold text-[#0f172a]">
        In-Demand Skills
      </h3>
      <div className="space-y-8">
        {skills.map((s) => (
          <div key={s.name} className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-800">{s.name}</span>
              <span className="text-blue-600">{s.match} Match</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${s.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
