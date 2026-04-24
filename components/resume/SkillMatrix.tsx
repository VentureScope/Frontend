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
            className="flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-[#eff6ff] px-4 py-2 text-[13px] font-bold text-[#1d59db]"
          >
            <span className="wrap-break-word">{skill}</span>
            <X
              size={14}
              className="shrink-0 cursor-pointer hover:text-blue-800"
            />
          </div>
        ))}

        {/* Suggested Skills (Rose) */}
        {suggestedSkills.map((skill) => (
          <div
            key={skill}
            className="flex max-w-full items-center gap-2 rounded-full border border-rose-100 bg-[#fff1f2] px-4 py-2 text-[13px] font-bold text-[#e11d48]"
          >
            <span className="wrap-break-word">{skill}</span>
            <Plus
              size={14}
              className="shrink-0 cursor-pointer hover:text-rose-800"
            />
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
