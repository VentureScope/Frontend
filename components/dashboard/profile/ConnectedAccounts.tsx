import { Share2, Github, GraduationCap } from "lucide-react";

export default function ConnectedAccounts() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-2 text-blue-600">
        <Share2 size={18} />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Connected Accounts
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-slate-50/50 p-3 border border-slate-100">
          <div className="flex items-center gap-3">
            <Github size={18} className="text-slate-600" />
            <span className="text-sm font-bold text-slate-700">GitHub</span>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
            LINKED
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50/50 p-3 border border-slate-100">
          <div className="flex items-center gap-3">
            <GraduationCap size={18} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-700">
              Academic Portal
            </span>
          </div>
          <button className="text-[9px] font-bold text-blue-600 hover:underline">
            CONNECT
          </button>
        </div>
      </div>
    </div>
  );
}
