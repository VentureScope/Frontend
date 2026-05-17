import { Sparkles, RotateCw } from "lucide-react";

export default function ProfessionalSummary() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-foreground">
            Professional Summary
          </h3>
          <Sparkles className="text-primary" size={16} />
        </div>
        <button className="flex items-center gap-2 self-start text-xs font-bold text-primary hover:text-primary/90 sm:self-auto sm:text-sm">
          Re-generate AI <RotateCw size={14} />
        </button>
      </div>
      <div className="rounded-lg bg-muted p-5 text-sm italic leading-relaxed text-muted-foreground sm:p-6 sm:text-[15px] lg:p-8">
        Senior Product Designer with 6+ years of experience in fin-tech and
        digital curator aesthetics. Proven track record of increasing user
        engagement by 40% through intentional design systems and
        accessibility-first frameworks.
      </div>
    </div>
  );
}
