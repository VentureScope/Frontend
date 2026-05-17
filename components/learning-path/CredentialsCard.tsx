import { ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CredentialsCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h3 className="text-label mb-6 text-muted-foreground sm:mb-8">
        Curated Credentials
      </h3>

      <div className="mb-8 space-y-4 sm:mb-10">
        <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-muted p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary shadow-sm sm:h-12 sm:w-12">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold leading-tight text-foreground">
              AWS Certified Machine Learning
            </h4>
            <p className="text-label text-muted-foreground">Specialty Rank</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-lg border border-secondary/20 bg-secondary/10 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-secondary shadow-sm sm:h-12 sm:w-12">
            <Award className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold leading-tight text-foreground">
              Google Professional ML Engineer
            </h4>
            <p className="text-label text-muted-foreground">Cloud Mastery</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-xl border-border text-primary font-medium hover:bg-muted sm:h-14 sm:rounded-full"
      >
        View All Recommendations
      </Button>
    </div>
  );
}
