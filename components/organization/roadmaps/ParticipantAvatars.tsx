import type { RoadmapParticipant } from "@/types/organization-roadmap";
import { cn } from "@/lib/utils";

export function ParticipantAvatars({
  participants,
  max = 4,
  className,
}: {
  participants: RoadmapParticipant[];
  max?: number;
  className?: string;
}) {
  const visible = participants.slice(0, max);
  const extra = participants.length - visible.length;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {visible.map((p) => (
          <span
            key={p.id}
            title={p.name}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-foreground"
          >
            {p.initials}
          </span>
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-[10px] font-medium text-muted-foreground">
          +{extra} more
        </span>
      )}
    </div>
  );
}
