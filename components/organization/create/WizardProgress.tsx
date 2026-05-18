import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/lib/organization-create-constants";
import type { CreateOrganizationStep } from "@/types/organization-create";

/** Segment progress bar — shown on every wizard step (1–8). */
export function WizardStepProgress({
  currentStep,
}: {
  currentStep: CreateOrganizationStep;
}) {
  return (
    <div className="flex gap-1.5">
      {WIZARD_STEPS.map((step) => (
        <div
          key={step.key}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            step.id <= currentStep ? "bg-primary" : "bg-muted",
          )}
          title={`Step ${step.id}: ${step.label}`}
        />
      ))}
    </div>
  );
}
