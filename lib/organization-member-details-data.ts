import { getOrganizationMember } from "@/lib/organization-members-storage";
import { USER_ORG_CONTEXTS } from "@/lib/organization-member-profile-data";
import type { OrganizationMemberProfile } from "@/types/organization-member";
import type { UserOrgSkillBenchmark } from "@/types/organization-profile";

function defaultBenchmarks(
  skills: string[],
  scores: number[],
): UserOrgSkillBenchmark[] {
  return skills.map((skill, i) => ({
    skill,
    yourScore: scores[i] ?? 70,
    roleMedian: (scores[i] ?? 70) - 8,
    orgTop: (scores[i] ?? 70) + 10,
    techTags: [skill],
  }));
}

type DetailOverride = Partial<
  Pick<
    OrganizationMemberProfile,
    | "roadmapsEnrolled"
    | "roadmapsCreated"
    | "peerGroupLabel"
    | "strengthSummary"
    | "developerInsight"
    | "growthAreas"
    | "skillBenchmarks"
  >
>;

const DETAIL_OVERRIDES: Record<string, DetailOverride> = {
  "acme-corp:user-jd": {
    roadmapsEnrolled: 3,
    roadmapsCreated: 2,
    peerGroupLabel: "Platform engineering",
    strengthSummary:
      "Jordan leads platform reliability initiatives with above-median Kubernetes and Go depth.",
    developerInsight:
      "Active across infrastructure repos; frequent reviewer on Terraform modules.",
    growthAreas: ["Cross-team API standards", "Cost optimization playbooks"],
    skillBenchmarks: defaultBenchmarks(
      ["Go", "Kubernetes", "Terraform", "SRE"],
      [86, 88, 82, 79],
    ),
  },
  "acme-corp:user-sm": {
    roadmapsEnrolled: 1,
    roadmapsCreated: 0,
    peerGroupLabel: "Security engineering",
    strengthSummary:
      "Sam's compliance and Python skills support Acme's regulated-industry clients.",
    developerInsight:
      "Security-focused contributions; limited public application repos.",
    growthAreas: ["Cloud security certifications", "Threat modeling workshops"],
    skillBenchmarks: defaultBenchmarks(
      ["Security", "Python", "Compliance"],
      [84, 76, 80],
    ),
  },
  "acme-corp:user-ak": {
    roadmapsEnrolled: 2,
    roadmapsCreated: 0,
    peerGroupLabel: "Frontend engineering",
    strengthSummary:
      "Ava ranks highly on accessibility and React delivery for customer dashboards.",
    developerInsight:
      "Consistent frontend PR velocity; champions design-system adoption.",
    growthAreas: ["Design tokens governance", "Performance profiling"],
    skillBenchmarks: defaultBenchmarks(
      ["React", "CSS", "Accessibility"],
      [88, 85, 90],
    ),
  },
  "globex-ind:user-pl": {
    roadmapsEnrolled: 1,
    roadmapsCreated: 0,
    peerGroupLabel: "Operations & analytics",
    strengthSummary:
      "Priya excels at supply-chain modeling and Excel-based scenario planning.",
    developerInsight:
      "Analytics profile driven by roadmap progress and operations datasets.",
    growthAreas: ["Python automation", "ESG data integration"],
    skillBenchmarks: defaultBenchmarks(
      ["Operations Research", "Excel", "R"],
      [78, 82, 71],
    ),
  },
  "globex-ind:user-rc": {
    roadmapsEnrolled: 0,
    roadmapsCreated: 2,
    peerGroupLabel: "Executive leadership",
    strengthSummary:
      "Riley steers sustainability reporting and policy alignment across regions.",
    developerInsight:
      "Leadership profile; engagement measured through org initiatives not repos.",
    growthAreas: ["Digital reporting tooling", "Stakeholder dashboards"],
    skillBenchmarks: defaultBenchmarks(["ESG", "Reporting", "Policy"], [92, 88, 90]),
  },
};

export function getOrganizationMemberProfile(
  orgId: string,
  memberId: string,
): OrganizationMemberProfile | null {
  const member = getOrganizationMember(orgId, memberId);
  if (!member) return null;

  const key = `${orgId}:${memberId}`;
  const override = DETAIL_OVERRIDES[key];

  if (member.isCurrentUser) {
    const ctx = USER_ORG_CONTEXTS.find((c) => c.orgId === orgId);
    if (ctx) {
      return {
        ...member,
        orgId,
        roadmapsEnrolled: ctx.roadmapsEnrolled,
        roadmapsCreated: ctx.roadmapsCreated,
        peerGroupLabel: ctx.peerGroupLabel,
        strengthSummary: ctx.strengthSummary,
        developerInsight: ctx.developerInsight,
        growthAreas: ctx.growthAreas,
        skillBenchmarks: ctx.skillBenchmarks,
      };
    }
  }

  const defaults: Omit<OrganizationMemberProfile, keyof typeof member | "orgId"> = {
    roadmapsEnrolled: member.isCurrentUser ? 2 : 1,
    roadmapsCreated: member.role === "owner" ? 1 : 0,
    peerGroupLabel: member.jobTitle,
    strengthSummary: `${member.name} contributes ${member.skills.slice(0, 2).join(" and ")} capabilities to the ${member.jobTitle} function.`,
    developerInsight: member.githubUsername
      ? `GitHub @${member.githubUsername} shows steady contribution patterns aligned with team roadmaps.`
      : "Profile driven by declared skills and learning-path progress in this organization.",
    growthAreas: [
      "Expand cross-functional collaboration",
      "Deepen stack alignment with org tech priorities",
    ],
    skillBenchmarks: defaultBenchmarks(
      member.skills,
      member.skills.map((_, i) => 72 + i * 4),
    ),
  };

  return {
    ...member,
    orgId,
    ...defaults,
    ...override,
    skillBenchmarks: override?.skillBenchmarks ?? defaults.skillBenchmarks,
  };
}
