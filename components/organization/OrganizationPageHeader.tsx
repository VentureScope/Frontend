import type { LucideIcon } from "lucide-react";

export function OrganizationPageHeader({
  label,
  title,
  description,
  icon: Icon,
}: {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <header className="mb-8 space-y-4 sm:mb-10">
      <div className="flex items-start gap-4">
        <div className="vs-icon-tile-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <span className="text-label text-primary">{label}</span>
          <h1 className="text-h1 text-foreground">{title}</h1>
          <p className="text-body max-w-2xl text-muted-foreground">{description}</p>
        </div>
      </div>
    </header>
  );
}
