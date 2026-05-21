import { adminCard } from "@/components/admin/ui/admin-styles";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  subtext?: string;
  valueClassName?: string;
  subtextClassName?: string;
};

export function AdminStatCard({
  label,
  value,
  subtext,
  valueClassName = "text-foreground",
  subtextClassName = "text-muted-foreground",
}: Props) {
  return (
    <div className={cn(adminCard, "p-4")}>
      <p className="mb-1 text-label text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-semibold tabular-nums", valueClassName)}>
        {value}
      </p>
      {subtext ? (
        <p className={cn("mt-1 text-xs", subtextClassName)}>{subtext}</p>
      ) : null}
    </div>
  );
}
