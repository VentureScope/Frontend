import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SettingsPremiumPanelProps = {
  title: string;
  description: string;
  features?: string[];
};

export function SettingsPremiumPanel({
  title,
  description,
  features = [],
}: SettingsPremiumPanelProps) {
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-primary/5 p-6 sm:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <div className="vs-icon-tile vs-icon-tile-primary h-12 w-12">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <Badge className="vs-badge vs-badge-warning border-none">
              Premium — coming soon
            </Badge>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {features.length > 0 ? (
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-primary">·</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
