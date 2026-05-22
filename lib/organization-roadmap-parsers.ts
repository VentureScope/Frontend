import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { roadmapOutToLearningPath } from "@/lib/map-roadmap-to-learning-path";
import { iconNameForTrend } from "@/lib/roadmap-utils";
import type {
  MemberRoadmapProgressApi,
  OrgRoadmapListItemApi,
  OrgRoadmapOutApi,
} from "@/types/organization-api";
import type {
  OrganizationRoadmap,
  RoadmapParticipant,
} from "@/types/organization-roadmap";
import type { OrganizationMember } from "@/types/organization-profile";
import type { RoadmapOut } from "@/types/roadmap";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "??";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

function memberLookup(members: OrganizationMember[]): Map<
  string,
  { name: string; initials: string }
> {
  const map = new Map<string, { name: string; initials: string }>();
  for (const m of members) {
    map.set(m.id, { name: m.name, initials: m.initials });
  }
  return map;
}

function participantsFromProgress(
  rows: MemberRoadmapProgressApi[],
  lookup: Map<string, { name: string; initials: string }>,
): RoadmapParticipant[] {
  return rows.map((row) => {
    const known = lookup.get(row.user_id);
    const name =
      row.full_name?.trim() || known?.name || row.user_id.slice(0, 8);
    return {
      id: row.user_id,
      name,
      initials: known?.initials ?? initialsFromName(name),
      progress: Math.round(
        Math.min(100, Math.max(0, row.completion_percentage)),
      ),
    };
  });
}

function participantsFromMembers(
  members: OrganizationMember[],
): RoadmapParticipant[] {
  return members.map((m) => ({
    id: m.id,
    name: m.name,
    initials: m.initials,
    progress: 0,
  }));
}

function focusLabel(trendName: string | null | undefined, title: string): string {
  const trend = trendName?.trim();
  if (trend) return trend;
  return title;
}

export function parseOrgRoadmapListItemApi(
  raw: unknown,
): OrgRoadmapListItemApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const roadmap_id = asString(row.roadmap_id);
  const title = asString(row.title);
  const created_at = asString(row.created_at);

  if (!id || !roadmap_id || !title || !created_at) return null;

  return {
    id,
    roadmap_id,
    title,
    created_at,
    trend_name:
      row.trend_name === null || typeof row.trend_name === "string"
        ? (row.trend_name as string | null)
        : undefined,
    total_weeks: asNumber(row.total_weeks, 0),
    total_members: asNumber(row.total_members, 0),
    aggregate_completion_percentage: asNumber(
      row.aggregate_completion_percentage,
      0,
    ),
  };
}

export function parseOrgRoadmapOutApi(raw: unknown): OrgRoadmapOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const roadmap_id = asString(row.roadmap_id);
  const title = asString(row.title);
  const created_at = asString(row.created_at);

  if (!id || !roadmap_id || !title || !created_at) return null;

  const per_member_progress: MemberRoadmapProgressApi[] = [];
  if (Array.isArray(row.per_member_progress)) {
    for (const entry of row.per_member_progress) {
      const m = asRecord(entry);
      if (!m) continue;
      const user_id = asString(m.user_id);
      if (!user_id) continue;
      per_member_progress.push({
        user_id,
        full_name:
          m.full_name === null || typeof m.full_name === "string"
            ? (m.full_name as string | null)
            : undefined,
        steps_completed: asNumber(m.steps_completed, 0),
        total_steps: asNumber(m.total_steps, 0),
        completion_percentage: asNumber(m.completion_percentage, 0),
      });
    }
  }

  return {
    id,
    roadmap_id,
    title,
    created_at,
    trend_name:
      row.trend_name === null || typeof row.trend_name === "string"
        ? (row.trend_name as string | null)
        : undefined,
    goal:
      row.goal === null || typeof row.goal === "string"
        ? (row.goal as string | null)
        : undefined,
    summary:
      row.summary === null || typeof row.summary === "string"
        ? (row.summary as string | null)
        : undefined,
    total_weeks: asNumber(row.total_weeks, 0),
    total_members: asNumber(row.total_members, 0),
    members_completed: asNumber(row.members_completed, 0),
    members_in_progress: asNumber(row.members_in_progress, 0),
    aggregate_completion_percentage: asNumber(
      row.aggregate_completion_percentage,
      0,
    ),
    per_member_progress,
  };
}

export function orgRoadmapListItemToOrganizationRoadmap(
  item: OrgRoadmapListItemApi,
  orgId: string,
  members: OrganizationMember[],
): OrganizationRoadmap {
  const icon = iconNameForTrend(item.trend_name);
  const participants =
    members.length > 0
      ? participantsFromMembers(members)
      : [];

  return {
    id: item.id,
    contentRoadmapId: item.roadmap_id,
    orgId,
    title: item.title,
    focus: focusLabel(item.trend_name, item.title),
    progress: Math.round(
      Math.min(100, Math.max(0, item.aggregate_completion_percentage)),
    ),
    iconName: icon,
    isExpanded: false,
    modules: [],
    createdAt: item.created_at,
    trendName: item.trend_name ?? null,
    totalWeeks: item.total_weeks,
    totalMembers: item.total_members,
    createdByUserId: "",
    createdByName: "Organization",
    participants,
  };
}

export function parseOrganizationRoadmapList(
  raw: unknown,
  orgId: string,
  members: OrganizationMember[],
): OrganizationRoadmap[] {
  if (!Array.isArray(raw)) return [];
  const items: OrganizationRoadmap[] = [];
  for (const entry of raw) {
    const parsed = parseOrgRoadmapListItemApi(entry);
    if (parsed) {
      items.push(orgRoadmapListItemToOrganizationRoadmap(parsed, orgId, members));
    }
  }
  return items;
}

export function mergeOrgRoadmapWithContent(
  orgRoadmap: OrgRoadmapOutApi,
  content: RoadmapOut,
  orgId: string,
  members: OrganizationMember[],
): OrganizationRoadmap {
  const lookup = memberLookup(members);
  const icon = iconNameForTrend(orgRoadmap.trend_name ?? content.trend_name);
  const base = roadmapOutToLearningPath(content, icon);
  const progressRows = orgRoadmap.per_member_progress ?? [];
  const participants =
    progressRows.length > 0
      ? participantsFromProgress(progressRows, lookup)
      : participantsFromMembers(members);

  const merged: OrganizationRoadmap = {
    ...base,
    id: orgRoadmap.id,
    contentRoadmapId: orgRoadmap.roadmap_id,
    orgId,
    title: orgRoadmap.title || base.title,
    focus: focusLabel(orgRoadmap.trend_name, orgRoadmap.title || base.title),
    progress: Math.round(
      Math.min(
        100,
        Math.max(0, orgRoadmap.aggregate_completion_percentage),
      ),
    ),
    createdAt: orgRoadmap.created_at,
    trendName: orgRoadmap.trend_name ?? content.trend_name ?? null,
    goal: orgRoadmap.goal ?? content.goal ?? null,
    summary: orgRoadmap.summary ?? content.summary ?? null,
    totalWeeks: orgRoadmap.total_weeks ?? content.total_weeks,
    totalMembers: orgRoadmap.total_members,
    createdByUserId: "",
    createdByName: "Organization",
    participants,
  };

  return merged;
}

export function patchRoadmapModules(
  roadmaps: OrganizationRoadmap[],
  orgRoadmapId: string,
  modules: LearningPath["modules"],
): OrganizationRoadmap[] {
  return roadmaps.map((r) =>
    r.id === orgRoadmapId ? { ...r, modules, isExpanded: modules.length > 0 } : r,
  );
}
