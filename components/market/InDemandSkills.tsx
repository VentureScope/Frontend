import { Progress } from "@/components/ui/progress";

const skills = [
  { name: "Go (Golang)", match: "89%", val: 89 },
  { name: "React / Next.js", match: "76%", val: 76 },
  { name: "System Design", match: "64%", val: 64 },
  { name: "Data Engineering", match: "52%", val: 52 },
];

export default function InDemandSkills() {
  return (
    <div className="vs-surface p-6 sm:p-8">
      <h3 className="mb-6 sm:mb-8 text-lg sm:text-xl font-bold text-foreground">
        In-Demand Skills
      </h3>
      <div className="space-y-6 sm:space-y-8">
        {skills.map((s) => (
          <div key={s.name} className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm font-bold">
              <span className="text-foreground">{s.name}</span>
              <span className="text-primary">{s.match} Match</span>
            </div>
            <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${s.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
