import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";

export interface RoadmapParticipant {
  id: string;
  name: string;
  initials: string;
  /** Personal completion 0–100 */
  progress: number;
}

/** Roadmap shared within an organization workspace */
export interface OrganizationRoadmap extends LearningPath {
  orgId: string;
  createdByUserId: string;
  createdByName: string;
  participants: RoadmapParticipant[];
  /** Company practice area id (e.g. frontend, backend) */
  focusAreaId?: string;
  focusAreaTitle?: string;
}

/** Declared company area + live team context for roadmap generation */
export interface OrgRoadmapFocusArea {
  id: string;
  title: string;
  description: string;
  iconName: string;
  /** Members whose role maps to this area */
  memberCount: number;
  memberPreview: string[];
  topSkills: string[];
  techStacks: string[];
  /** Passed to roadmap API as trend_name */
  generationTrendName: string;
  badge: string;
  badgeType: "team-backed" | "profile-only";
}

export type MyRoadmapsTab = "all" | "enrolled" | "created";

export type OrgTeamRoadmapsFilter = "all" | "created-by-me";

export type OrgRoadmapGenerationSource = "company-area-team";
