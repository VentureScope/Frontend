// components/learning-path/CredentialsCard.tsx
import { ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CredentialsCard() {
  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="mb-6 sm:mb-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
        Curated Credentials
      </h3>

      <div className="space-y-4 mb-8 sm:mb-10">
        {/* AWS Credential */}
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 sm:gap-5 rounded-2xl bg-blue-50/30 p-4 sm:p-5 border border-blue-50/50">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100/50 text-blue-600 shadow-sm">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              AWS Certified Machine Learning
            </h4>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Specialty Rank
            </p>
          </div>
        </div>

        {/* Google Credential */}
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 sm:gap-5 rounded-2xl bg-rose-50/30 p-4 sm:p-5 border border-rose-50/50">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100/50 text-rose-600 shadow-sm">
            <Award className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              Google Professional ML Engineer
            </h4>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Cloud Mastery
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-12 w-full sm:h-14 rounded-xl sm:rounded-full border-blue-100 text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-200 transition-all text-xs sm:text-sm"
      >
        View All Recommendations
      </Button>
    </div>
  );
}
