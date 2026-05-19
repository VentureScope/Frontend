import { cn } from "@/lib/utils";

export function AdminRoleBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
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
    emerald: "border-emerald-800 bg-emerald-950 text-emerald-400",
    red: "border-red-800 bg-red-950 text-red-400",
    amber: "border-amber-800 bg-amber-950 text-amber-400",
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
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    zinc: "bg-zinc-600",
  };
  return (
    <span className={cn("inline-block h-2 w-2 rounded-full", colors[tone])} />
  );
}
