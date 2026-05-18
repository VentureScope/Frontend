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
}

export type MyRoadmapsTab = "all" | "enrolled" | "created";

export type OrgTeamRoadmapsFilter = "all" | "created-by-me";
