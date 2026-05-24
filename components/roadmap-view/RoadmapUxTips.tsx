import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CheckCircle2,
  Layers,
  MapPinned,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type RoadmapUxTipsVariant =
  | "personal-list"
  | "personal-detail"
  | "org-team-list"
  | "org-my-list"
  | "org-detail";

type TipConfig = {
  icon: LucideIcon;
  title: string;
  bullets: string[];
};

const TIPS: Record<RoadmapUxTipsVariant, TipConfig> = {
  "personal-list": {
    icon: BookOpen,
    title: "How learning paths work",
    bullets: [
      "Summary cards load first — expand a roadmap to fetch weeks and resources.",
      "Tap a resource to mark it done; your progress saves instantly.",
      "Open the full roadmap (title link) for a focused, distraction-free view.",
    ],
  },
  "personal-detail": {
    icon: CheckCircle2,
    title: "Track your progress",
    bullets: [
      "Each resource checkbox updates your roadmap automatically — no save button needed.",
      "Uncheck a resource anytime to revise your progress.",
    ],
  },
  "org-team-list": {
    icon: Users,
    title: "Team roadmaps",
    bullets: [
      "Cards show team stats and your enrollment — expand to load weeks and resources.",
      "Your checkmarks use the same progress system as personal learning paths.",
      "Fork a teammate's path to keep a private copy under My roadmaps.",
      "Open full detail to see everyone on the path and your personal progress bar.",
    ],
  },
  "org-my-list": {
    icon: MapPinned,
    title: "Your organization roadmaps",
    bullets: [
      "Progress and enrollment come from each organization — expand to load lesson content.",
      "Roadmaps you created appear under Created by me; paths you're taking under Taking.",
      "Team-wide catalogs live on each organization's Team roadmaps page.",
    ],
  },
  "org-detail": {
    icon: Layers,
    title: "Focus on the lessons",
    bullets: [
      "Weeks and resources load from your learning path — check them off as you go.",
      "Use Enroll to join the team roadmap, or Fork to keep a private copy.",
      "Progress saves automatically when you tap a resource.",
    ],
  },
};

/** Rule-of-thumb hints for roadmap list vs detail UX (personal + org). */
export function RoadmapUxTips({
  variant,
  className,
  compact = false,
}: {
  variant: RoadmapUxTipsVariant;
  className?: string;
  compact?: boolean;
}) {
  const { icon: Icon, title, bullets } = TIPS[variant];

  return (
    <div
      className={cn(
        "vs-surface-accent flex gap-4 rounded-md border border-border",
        compact ? "p-3 sm:p-4" : "p-4 sm:p-5",
        className,
      )}
      role="note"
      aria-label={title}
    >
      <div
        className={cn(
          "vs-icon-tile-primary flex shrink-0 items-center justify-center rounded-md",
          compact ? "h-9 w-9" : "h-10 w-10",
        )}
      >
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
      </div>
      <div className="min-w-0 space-y-2">
        <p
          className={cn(
            "font-semibold text-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {title}
        </p>
        <ul
          className={cn(
            "space-y-1.5 text-muted-foreground",
            compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed",
          )}
        >
          {bullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Shown while GET /api/roadmaps/{roadmap_id} loads on expand. */
export function RoadmapModulesLoadingHint() {
  return (
    <p className="mb-6 text-center text-sm text-muted-foreground">
      Loading weeks and resources…
    </p>
  );
}
