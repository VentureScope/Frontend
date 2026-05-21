import type { DagRunStatus } from "@/types/admin-system";

export function DagStatusLabel({ status }: { status: DagRunStatus }) {
  switch (status) {
    case "success":
      return (
        <span className="font-mono text-xs text-primary">✓ success</span>
      );
    case "failed":
      return (
        <span className="font-mono text-xs text-destructive">✗ failed</span>
      );
    case "running":
      return (
        <span className="font-mono text-xs text-warning">● running</span>
      );
    default:
      return (
        <span className="font-mono text-xs text-muted-foreground">— unknown</span>
      );
  }
}

export function MlStatusLabel({ status }: { status: string }) {
  if (status === "failed") {
    return <span className="font-mono text-xs text-destructive">✗ failed</span>;
  }
  if (status === "training") {
    return <span className="font-mono text-xs text-warning">● training</span>;
  }
  if (status === "awaiting_review") {
    return <span className="font-mono text-xs text-warning">◆ review</span>;
  }
  if (status === "deployed") {
    return <span className="font-mono text-xs text-primary">✓ deployed</span>;
  }
  return <span className="font-mono text-xs text-muted-foreground">{status}</span>;
}
