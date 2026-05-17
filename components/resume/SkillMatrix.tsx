import { X, Plus } from "lucide-react";

const activeSkills = ["React.js", "Tailwind CSS"];
const suggestedSkills = ["Data Visualization", "TypeScript"];

export default function SkillMatrix() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground">
        Skill Intelligence Matrix
      </h3>

      <div className="flex flex-wrap gap-3">
        {/* Active Skills (Blue) */}
        {activeSkills.map((skill) => (
          <div
            key={skill}
            className="flex max-w-full items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-[13px] font-bold text-primary"
          >
            <span className="wrap-break-word">{skill}</span>
            <X
              size={14}
              className="shrink-0 cursor-pointer hover:text-primary/80"
            />
          </div>
        ))}

        {/* Suggested Skills (Rose) */}
        {suggestedSkills.map((skill) => (
          <div
            key={skill}
            className="flex max-w-full items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-[13px] font-bold text-destructive"
          >
            <span className="wrap-break-word">{skill}</span>
            <Plus
              size={14}
              className="shrink-0 cursor-pointer hover:text-destructive/80"
            />
          </div>
        ))}
      </div>

      <p className="text-xs font-medium text-muted-foreground">
        Highlighted skills match{" "}
        <span className="text-muted-foreground font-bold">85%</span> of your target job
        description.
      </p>
    </div>
  );
}
