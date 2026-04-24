import { Plus } from "lucide-react";

export default function ExperienceHistory() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900">Experience History</h3>

      <div className="space-y-6">
        {/* Experience Card */}
        <div className="rounded-[28px] border border-slate-100 bg-[#f8fafc] p-5 sm:p-6 lg:p-8">
          <div className="mb-4 space-y-1">
            <h4 className="wrap-break-word text-base font-bold text-slate-900 sm:text-lg">
              Lead Designer @ FinSphere
            </h4>
            <p className="wrap-break-word text-[11px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
              2021 — Present • San Francisco
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex gap-3 text-sm leading-relaxed text-slate-600">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
              <span>
                Architected the "Aura" Design System used by 12+ internal teams.
              </span>
            </li>
            <li className="flex gap-3 text-sm leading-relaxed text-slate-600">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="rounded-md bg-blue-100/60 px-2 py-0.5 font-bold text-blue-700">
                  Optimized
                </span>
                <span>
                  dashboard load times by 60% through asset management.
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Add Position Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-5 text-xs font-bold text-slate-400 transition-all hover:border-blue-200 hover:bg-slate-50 hover:text-blue-600 sm:py-6 sm:text-sm">
          <Plus size={18} /> Add Experience Position
        </button>
      </div>
    </div>
  );
}
