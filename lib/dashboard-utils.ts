import type { NotificationItem } from "@/types/notifications";
import type { JobMatch } from "@/types/jobs";
import type { RoadmapListItem } from "@/types/roadmap";

export function formatRelativeTime(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function jobMatchToPercent(match: JobMatch | undefined): number | null {
  if (!match || match.distance == null) return null;
  return Math.round(Math.min(100, Math.max(0, 100 - match.distance * 100)));
}

export function notificationSourceLabel(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("chat")) return "AI Advisor";
  if (t.includes("roadmap") || t.includes("learning")) return "Learning Path";
  if (t.includes("resume")) return "Resume Builder";
  if (t.includes("transcript") || t.includes("academic")) return "Data Hub";
  if (t.includes("github")) return "Data Hub";
  if (t.includes("job") || t.includes("market")) return "Market Trends";
  return "Platform";
}

export function notificationBadgeClass(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("chat")) return "vs-badge vs-badge-accent";
  if (t.includes("roadmap") || t.includes("learning")) {
    return "vs-badge vs-badge-accent";
  }
  if (t.includes("resume")) return "vs-badge vs-badge-warning";
  if (t.includes("transcript") || t.includes("github")) {
    return "vs-badge vs-badge-success";
  }
  return "vs-badge vs-badge-success";
}

export function notificationDotClass(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("chat")) return "bg-accent";
  if (t.includes("resume")) return "bg-warning";
  if (t.includes("roadmap")) return "bg-accent";
  return "bg-success";
}

export type DashboardActivityItem = {
  id: string;
  title: string;
  time: string;
  badge: string;
  badgeClass: string;
  dotClass: string;
  href: string;
};

export function getNotificationHref(n: NotificationItem): string {
  const meta = n.metadata_ ?? {};
  if (typeof meta.href === "string") return meta.href;
  if (typeof meta.link === "string") return meta.link;

  const t = n.notification_type.toLowerCase();
  if (t.includes("chat") && typeof meta.session_id === "string") {
    return `/dashboard/ai-advisor?session=${encodeURIComponent(meta.session_id)}`;
  }

  return notificationDefaultHref(n.notification_type);
}

export function mapNotificationToActivity(
  n: NotificationItem,
): DashboardActivityItem {
  return {
    id: n.id,
    title: n.title,
    time: formatRelativeTime(n.created_at),
    badge: notificationSourceLabel(n.notification_type),
    badgeClass: notificationBadgeClass(n.notification_type),
    dotClass: notificationDotClass(n.notification_type),
    href: getNotificationHref(n),
  };
}

function notificationDefaultHref(notificationType: string): string {
  const t = notificationType.toLowerCase();
  if (t.includes("chat")) return "/dashboard/ai-advisor";
  if (t.includes("roadmap") || t.includes("learning")) {
    return "/dashboard/learning-path";
  }
  if (t.includes("resume")) return "/dashboard/resume-builder";
  if (t.includes("transcript") || t.includes("github")) {
    return "/dashboard/data-hub";
  }
  if (t.includes("job") || t.includes("market")) {
    return "/dashboard/market-trends";
  }
  return "/dashboard/profile";
}

export function pickActiveRoadmap(
  roadmaps: RoadmapListItem[],
): RoadmapListItem | null {
  if (roadmaps.length === 0) return null;
  const inProgress = roadmaps.filter(
    (r) =>
      (r.completion_percentage ?? 0) > 0 &&
      (r.completion_percentage ?? 0) < 100,
  );
  const pool = inProgress.length > 0 ? inProgress : roadmaps;
  return [...pool].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];
}
