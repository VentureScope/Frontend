import type { UserOrganizationContext } from "@/types/organization-profile";

export const USER_ORG_CONTEXTS: UserOrganizationContext[] = [
  {
    orgId: "acme-corp",
    role: "owner",
    jobTitle: "Head of Engineering",
    memberSince: "2024-01-15",
    roadmapsEnrolled: 2,
    roadmapsCreated: 1,
    peerGroupLabel: "Engineering leadership",
    strengthSummary:
      "Your TypeScript and system design signals rank above most peers in engineering leadership at Acme.",
    developerInsight:
      "GitHub activity aligns with platform modernization initiatives—strong depth in API and frontend repos.",
    growthAreas: ["Formalize SRE practices", "Expand ML literacy for product bets"],
    skillBenchmarks: [
      {
        skill: "TypeScript",
        yourScore: 88,
        roleMedian: 72,
        orgTop: 94,
        techTags: ["TypeScript", "JavaScript", "React"],
      },
      {
        skill: "System Design",
        yourScore: 85,
        roleMedian: 68,
        orgTop: 91,
        techTags: ["Kubernetes", "AWS"],
      },
      {
        skill: "React",
        yourScore: 79,
        roleMedian: 74,
        orgTop: 89,
        techTags: ["React", "TypeScript", "Next.js"],
      },
      {
        skill: "AWS",
        yourScore: 71,
        roleMedian: 65,
        orgTop: 88,
        techTags: ["AWS", "Kubernetes"],
      },
      {
        skill: "Team Leadership",
        yourScore: 82,
        roleMedian: 70,
        orgTop: 90,
        techTags: [],
      },
    ],
  },
  {
    orgId: "globex-ind",
    role: "admin",
    jobTitle: "Operations Analyst",
    memberSince: "2025-01-08",
    roadmapsEnrolled: 2,
    roadmapsCreated: 1,
    peerGroupLabel: "Operations & analytics",
    strengthSummary:
      "Forecasting and SQL skills place you in the top third of operations analysts at Globex.",
    developerInsight:
      "Limited public repo activity; profile is driven by roadmap progress and declared skills.",
    growthAreas: ["ESG reporting frameworks", "Advanced scenario modeling"],
    skillBenchmarks: [
      {
        skill: "Python",
        yourScore: 76,
        roleMedian: 68,
        orgTop: 85,
        techTags: ["Python"],
      },
      {
        skill: "SQL",
        yourScore: 81,
        roleMedian: 71,
        orgTop: 88,
        techTags: ["SQL", "PostgreSQL"],
      },
      {
        skill: "Forecasting",
        yourScore: 74,
        roleMedian: 69,
        orgTop: 82,
        techTags: ["Python"],
      },
      {
        skill: "Tableau",
        yourScore: 65,
        roleMedian: 62,
        orgTop: 79,
        techTags: ["Tableau"],
      },
      {
        skill: "Operations Research",
        yourScore: 58,
        roleMedian: 64,
        orgTop: 80,
        techTags: [],
      },
    ],
  },
];

export function getUserOrgContext(orgId: string): UserOrganizationContext | null {
  return USER_ORG_CONTEXTS.find((c) => c.orgId === orgId) ?? null;
}
