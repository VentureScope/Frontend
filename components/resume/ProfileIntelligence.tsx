// components/resume/ProfileIntelligence.tsx
import { Github, GraduationCap, CheckCircle2, Code2 } from "lucide-react";

export default function ProfileIntelligence() {
  return (
    <div className="rounded-[32px] bg-white p-10 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900">Profile Intelligence</h3>
        <span className="text-xs font-bold text-slate-400">Last synced: 2 mins ago</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* GitHub Card */}
        <div className="flex items-center gap-4 rounded-3xl bg-[#f4f7ff] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-blue-600">
            <Code2 size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">GitHub Analytics</h4>
            <p className="text-[11px] text-slate-500 font-medium">12 Repositories, 480 Commits</p>
          </div>
        </div>

        {/* Academic Card */}
        <div className="flex items-center justify-between rounded-3xl border-2 border-blue-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6ff] text-blue-600">
              <GraduationCap size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">eStudent Sync</h4>
              <p className="text-[11px] text-slate-500 font-medium">GPA: 3.9/4.0, CS Honours</p>
            </div>
          </div>
          <CheckCircle2 className="text-blue-600" size={20} />
        </div>
      </div>
    </div>
  );
}

// components/resume/ProfessionalSummary.tsx
