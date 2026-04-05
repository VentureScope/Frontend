// components/data-hub/AcademicStatusCard.tsx
import { GraduationCap, FileText, UploadCloud } from "lucide-react";

export default function AcademicStatusCard() {
  return (
    <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <GraduationCap size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Academic Extraction Status
            </h3>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              Last extraction: 2 hours ago{" "}
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Latest Batch
            </p>
            <p className="font-bold text-slate-900">
              Semester 4 Grades Processed
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              GPA Weighted
            </p>
            <p className="text-lg font-bold text-blue-600">3.82 / 4.0</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-blue-50 px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-100">
              <FileText size={16} /> View Full Transcript
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              <UploadCloud size={16} /> Update Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
