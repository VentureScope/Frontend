// components/learning-path/CredentialsCard.tsx
import { ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CredentialsCard() {
  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border bg-card p-6 sm:p-8 shadow-sm">
      <h3 className="mb-6 sm:mb-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Curated Credentials
      </h3>

      <div className="space-y-4 mb-8 sm:mb-10">
        {/* AWS Credential */}
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 sm:gap-5 rounded-2xl bg-primary/10 p-4 sm:p-5 border border-blue-50/50">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-black text-foreground leading-tight">
              AWS Certified Machine Learning
            </h4>
            <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
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
            <h4 className="text-xs sm:text-sm font-black text-foreground leading-tight">
              Google Professional ML Engineer
            </h4>
            <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Cloud Mastery
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-12 w-full sm:h-14 rounded-xl sm:rounded-full border-primary/20 text-primary font-bold hover:bg-primary/10 hover:border-primary/30 transition-all text-xs sm:text-sm"
      >
        View All Recommendations
      </Button>
    </div>
  );
}
