import type { OrganizationMember, UserOrgSkillBenchmark } from "@/types/organization-profile";

/** Member profile within an organization (directory + intelligence). */
export type OrganizationMemberProfile = OrganizationMember & {
  orgId: string;
  roadmapsEnrolled: number;
  roadmapsCreated: number;
  peerGroupLabel: string;
  strengthSummary: string;
  developerInsight: string;
  growthAreas: string[];
  skillBenchmarks: UserOrgSkillBenchmark[];
};
