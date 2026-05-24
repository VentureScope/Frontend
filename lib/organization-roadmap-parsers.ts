import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import { roadmapOutToLearningPath } from "@/lib/map-roadmap-to-learning-path";
import { iconNameForTrend } from "@/lib/roadmap-utils";
import type {
  MemberRoadmapProgressApi,
  MyEnrollmentApi,
  OrgRoadmapListItemApi,
  OrgRoadmapOutApi,
} from "@/types/organization-api";
import type {
  MyRoadmapEnrollment,
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

function focusLabel(trendName: string | null | undefined, title: string): string {
  const trend = trendName?.trim();
  if (trend) return trend;
  return title;
}

function parseMyEnrollmentApi(raw: unknown): MyEnrollmentApi | null {
  const row = asRecord(raw);
  if (!row || typeof row.enrolled !== "boolean") return null;
  return {
    enrolled: row.enrolled,
    steps_completed: asNumber(row.steps_completed, 0),
    total_steps: asNumber(row.total_steps, 0),
    completion_percentage: asNumber(row.completion_percentage, 0),
  };
}

function toMyRoadmapEnrollment(
  api: MyEnrollmentApi | null | undefined,
): MyRoadmapEnrollment | undefined {
  if (!api) return undefined;
  return {
    enrolled: api.enrolled,
    stepsCompleted: api.steps_completed ?? 0,
    totalSteps: api.total_steps ?? 0,
    completionPercentage: api.completion_percentage ?? 0,
  };
}

function createdByFields(
  createdByUserId: string | null | undefined,
  createdByName: string | null | undefined,
) {
  return {
    createdByUserId: createdByUserId?.trim() ?? "",
    createdByName: createdByName?.trim() || "Organization",
  };
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
    created_by_user_id:
      row.created_by_user_id === null ||
      typeof row.created_by_user_id === "string"
        ? (row.created_by_user_id as string | null)
        : undefined,
    created_by_name:
      row.created_by_name === null || typeof row.created_by_name === "string"
        ? (row.created_by_name as string | null)
        : undefined,
    my_enrollment: parseMyEnrollmentApi(row.my_enrollment),
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
    created_by_user_id:
      row.created_by_user_id === null ||
      typeof row.created_by_user_id === "string"
        ? (row.created_by_user_id as string | null)
        : undefined,
    created_by_name:
      row.created_by_name === null || typeof row.created_by_name === "string"
        ? (row.created_by_name as string | null)
        : undefined,
    my_enrollment: parseMyEnrollmentApi(row.my_enrollment),
  };
}

export function orgRoadmapListItemToOrganizationRoadmap(
  item: OrgRoadmapListItemApi,
  orgId: string,
  members: OrganizationMember[],
): OrganizationRoadmap {
  const icon = iconNameForTrend(item.trend_name);
  const participants: RoadmapParticipant[] = [];

  const createdBy = createdByFields(
    item.created_by_user_id,
    item.created_by_name,
  );
  const myEnrollment = toMyRoadmapEnrollment(item.my_enrollment);

  return {
    id: item.roadmap_id,
    contentRoadmapId: item.roadmap_id,
    assignmentId: item.id,
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
    ...createdBy,
    myEnrollment,
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

export function orgRoadmapOutToOrganizationRoadmap(
  orgRoadmap: OrgRoadmapOutApi,
  orgId: string,
  members: OrganizationMember[],
): OrganizationRoadmap {
  const lookup = memberLookup(members);
  const icon = iconNameForTrend(orgRoadmap.trend_name);
  const progressRows = orgRoadmap.per_member_progress ?? [];
  const participants =
    progressRows.length > 0
      ? participantsFromProgress(progressRows, lookup)
      : [];

  const createdBy = createdByFields(
    orgRoadmap.created_by_user_id,
    orgRoadmap.created_by_name,
  );
  const myEnrollment = toMyRoadmapEnrollment(orgRoadmap.my_enrollment);

  return {
    id: orgRoadmap.roadmap_id,
    contentRoadmapId: orgRoadmap.roadmap_id,
    assignmentId: orgRoadmap.id,
    orgId,
    title: orgRoadmap.title,
    focus: focusLabel(orgRoadmap.trend_name, orgRoadmap.title),
    progress: Math.round(
      Math.min(
        100,
        Math.max(0, orgRoadmap.aggregate_completion_percentage),
      ),
    ),
    iconName: icon,
    isExpanded: false,
    modules: [],
    createdAt: orgRoadmap.created_at,
    trendName: orgRoadmap.trend_name ?? null,
    goal: orgRoadmap.goal ?? null,
    summary: orgRoadmap.summary ?? null,
    totalWeeks: orgRoadmap.total_weeks,
    totalMembers: orgRoadmap.total_members,
    ...createdBy,
    myEnrollment,
    participants,
  };
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
      : [];

  const createdBy = createdByFields(
    orgRoadmap.created_by_user_id,
    orgRoadmap.created_by_name,
  );
  const myEnrollment = toMyRoadmapEnrollment(orgRoadmap.my_enrollment);

  const merged: OrganizationRoadmap = {
    ...base,
    id: orgRoadmap.roadmap_id,
    contentRoadmapId: orgRoadmap.roadmap_id,
    assignmentId: orgRoadmap.id,
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
    ...createdBy,
    myEnrollment,
    participants,
  };

  return merged;
}

/** Attach full step/resource content from GET /api/roadmaps/{roadmap_id}. */
export function mergeRoadmapContentIntoOrgRoadmap(
  orgRoadmap: OrganizationRoadmap,
  content: RoadmapOut,
): OrganizationRoadmap {
  const icon = iconNameForTrend(orgRoadmap.trendName ?? content.trend_name);
  const learningPath = roadmapOutToLearningPath(content, icon);

  return {
    ...orgRoadmap,
    modules: learningPath.modules,
    isExpanded: learningPath.modules.length > 0,
    stepsCompleted: learningPath.stepsCompleted,
    totalSteps: learningPath.totalSteps,
    roadmapStatus: learningPath.roadmapStatus,
    goal: orgRoadmap.goal ?? content.goal ?? null,
    summary: orgRoadmap.summary ?? content.summary ?? null,
    totalWeeks: orgRoadmap.totalWeeks ?? content.total_weeks,
    trendName: orgRoadmap.trendName ?? content.trend_name ?? null,
  };
}

export function patchRoadmapModules(
  roadmaps: OrganizationRoadmap[],
  orgRoadmapId: string,
  modules: LearningPath["modules"],
): OrganizationRoadmap[] {
  return roadmaps.map((r) =>
    r.id === orgRoadmapId ||
    r.contentRoadmapId === orgRoadmapId ||
    r.assignmentId === orgRoadmapId
      ? { ...r, modules, isExpanded: modules.length > 0 }
      : r,
  );
}
