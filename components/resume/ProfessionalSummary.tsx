import { Sparkles, RotateCw } from "lucide-react";

export default function ProfessionalSummary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900">
            Professional Summary
          </h3>
          <Sparkles className="text-blue-500" size={16} />
        </div>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
          Re-generate AI <RotateCw size={14} />
        </button>
      </div>
      <div className="rounded-2xl bg-slate-50 p-8 text-[15px] leading-relaxed text-slate-600 italic">
        Senior Product Designer with 6+ years of experience in fin-tech and
        digital curator aesthetics. Proven track record of increasing user
        engagement by 40% through intentional design systems and
        accessibility-first frameworks.
      </div>
    </div>
  );
}
