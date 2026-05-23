import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";

export interface RoadmapParticipant {
  id: string;
  name: string;
  initials: string;
  /** Personal completion 0–100 */
  progress: number;
}

/** Source attribution when a user forks a teammate's org roadmap */
export interface OrgRoadmapForkSource {
  roadmapId: string;
  title: string;
  createdByName: string;
}

/** Current user's enrollment on a team roadmap (from API `my_enrollment`). */
export interface MyRoadmapEnrollment {
  enrolled: boolean;
  stepsCompleted: number;
  totalSteps: number;
  completionPercentage: number;
}

/** Roadmap shared within an organization workspace */
export interface OrganizationRoadmap extends LearningPath {
  orgId: string;
  /** Underlying learning roadmap id (`GET /api/roadmaps/{id}`). */
  contentRoadmapId?: string;
  createdByUserId: string;
  createdByName: string;
  participants: RoadmapParticipant[];
  /** Current user's enrollment/progress when returned by the API. */
  myEnrollment?: MyRoadmapEnrollment;
  /** Members assigned to this org roadmap (from API `total_members`). */
  totalMembers?: number;
  /** Company practice area id (e.g. frontend, backend) */
  focusAreaId?: string;
  focusAreaTitle?: string;
  /** Set on personal copies forked from a team roadmap */
  forkedFrom?: OrgRoadmapForkSource;
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
