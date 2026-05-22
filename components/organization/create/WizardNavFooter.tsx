import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type WizardNavFooterProps = {
  onBack?: () => void;
  onNext: () => void;
  showBack?: boolean;
  isLastStep?: boolean;
  nextDisabled?: boolean;
  nextLoading?: boolean;
};

export function WizardNavFooter({
  onBack,
  onNext,
  showBack = true,
  isLastStep = false,
  nextDisabled = false,
  nextLoading = false,
}: WizardNavFooterProps) {
  const label = nextLoading
    ? "Creating…"
    : isLastStep
      ? "Complete setup"
      : "Next";

  return (
    <footer className="flex items-center justify-between gap-4 border-t border-border pt-6">
      {showBack && onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={nextLoading}
          className="gap-2 font-semibold uppercase tracking-wide"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      ) : (
        <div />
      )}
      <Button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="gap-2 px-6 font-semibold uppercase tracking-wide"
      >
        {label}
        {nextLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLastStep ? (
          <Check className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </footer>
  );
}
