import { cn } from "@/lib/utils";

export function AdminRoleBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
      {children}
    </span>
  );
}

export function AdminActionBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "emerald" | "red" | "amber";
}) {
  const styles = {
    emerald: "border-primary/30 bg-primary/10 text-primary",
    red: "border-destructive/30 bg-destructive/10 text-destructive",
    amber: "border-warning/40 bg-warning/10 text-warning",
  };
  return (
    <span
      className={cn(
        "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-semibold",
        styles[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone }: { tone: "emerald" | "amber" | "zinc" }) {
  const colors = {
    emerald: "bg-primary",
    amber: "bg-warning",
    zinc: "bg-muted-foreground",
  };
  return (
    <span className={cn("inline-block h-2 w-2 rounded-full", colors[tone])} />
  );
}
