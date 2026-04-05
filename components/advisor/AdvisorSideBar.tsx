import { Terminal, ArrowLeftRight, RotateCcw } from "lucide-react";

export default function AdvisorSideBar() {
  return (
    <div className="space-y-12">
      {/* Match Score Card */}
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-full border-4 border-blue-600 flex items-center justify-center text-xl font-bold text-slate-900">
            84
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Match Score</h3>
            <p className="text-xs text-slate-400">vs. Top Tier Roles</p>
          </div>
        </div>

        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              <span>Technical Skill Alignment</span>
              <span className="text-blue-600">92%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "92%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              <span>Market Reach</span>
              <span className="text-blue-600">68%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "68%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Quick Actions
        </h4>
        <div className="space-y-3">
          {[
            { label: "How do I improve my GitHub for DevOps?", icon: Terminal },
            {
              label: "Compare my profile to Senior Architect X",
              icon: ArrowLeftRight,
            },
            {
              label: "Check salary benchmarks in Addis Ababa",
              icon: RotateCcw,
            },
          ].map((action, i) => (
            <button
              key={i}
              className="group flex flex-col items-start gap-4 w-full p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-left"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100">
                <action.icon size={16} />
              </div>
              <p className="text-xs font-bold text-slate-800 leading-snug">
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Advisor Info Card */}
      <div className="mt-auto rounded-[32px] bg-[#020617] p-8 text-white relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <h3 className="text-xl font-bold">VentureScope Advisor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Leveraging GPT-4 Turbo and vector embeddings of over 2M job
            descriptions.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            System Operational
          </div>
        </div>
      </div>
    </div>
  );
}
