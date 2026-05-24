import type { OrganizationMemberProfile } from "@/types/organization-member";
import type {
  OrganizationMember,
  UserOrgSkillBenchmark,
} from "@/types/organization-profile";

function defaultBenchmarks(
  skills: string[],
): UserOrgSkillBenchmark[] {
  return skills.map((skill, i) => ({
    skill,
    yourScore: 70 + Math.min(i * 3, 15),
    roleMedian: 65 + Math.min(i * 2, 10),
    orgTop: 82 + Math.min(i, 8),
    techTags: [skill],
  }));
}

function buildProfileForMember(
  orgId: string,
  member: OrganizationMember,
): OrganizationMemberProfile {
  const skillList = member.skills.filter(Boolean);

  return {
    ...member,
    orgId,
    roadmapsEnrolled: 0,
    roadmapsCreated: 0,
    peerGroupLabel: member.jobTitle || "Team member",
    strengthSummary: skillList.length
      ? `Declared skills: ${skillList.join(", ")}.`
      : "Add skills in your account profile to populate skill intelligence.",
    developerInsight: member.githubUsername
      ? `GitHub @${member.githubUsername} — activity signals appear when repos are linked.`
      : "Connect GitHub in settings for developer activity in this org context.",
    growthAreas: skillList.length
      ? [
          "Align learning paths with team roadmaps",
          "Expand depth on priority stack skills",
        ]
      : ["Complete your skills profile", "Enroll in a team roadmap"],
    skillBenchmarks: defaultBenchmarks(skillList),
  };
}

export function getOrganizationMemberProfile(
  orgId: string,
  member: OrganizationMember | null,
): OrganizationMemberProfile | null {
  if (!member) return null;
  return buildProfileForMember(orgId, member);
}
