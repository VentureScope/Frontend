import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type MarketSectionErrorProps = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function MarketSectionError({
  message,
  onRetry,
  className = "",
}: MarketSectionErrorProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-start gap-2 text-sm text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={onRetry}
        >
          Retry
        </Button>
      ) : null}
    </div>
  );
}
