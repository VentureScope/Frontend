import { X, Plus } from "lucide-react";

const activeSkills = ["React.js", "Tailwind CSS"];
const suggestedSkills = ["Data Visualization", "TypeScript"];

export default function SkillMatrix() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900">
        Skill Intelligence Matrix
      </h3>

      <div className="flex flex-wrap gap-3">
        {/* Active Skills (Blue) */}
        {activeSkills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-2 rounded-full bg-[#eff6ff] px-4 py-2 text-[13px] font-bold text-[#1d59db] border border-blue-100"
          >
            {skill}{" "}
            <X size={14} className="cursor-pointer hover:text-blue-800" />
          </div>
        ))}

        {/* Suggested Skills (Rose) */}
        {suggestedSkills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-2 rounded-full bg-[#fff1f2] px-4 py-2 text-[13px] font-bold text-[#e11d48] border border-rose-100"
          >
            {skill}{" "}
            <Plus size={14} className="cursor-pointer hover:text-rose-800" />
          </div>
        ))}
      </div>

      <p className="text-xs font-medium text-slate-400">
        Highlighted skills match{" "}
        <span className="text-slate-600 font-bold">85%</span> of your target job
        description.
      </p>
    </div>
  );
}
