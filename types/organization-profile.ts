import type { DeveloperEcosystemEntry } from "@/types/organization-create";
import type { OrganizationRole } from "@/types/organization";

export interface OrganizationCustomField {
  id: string;
  label: string;
  value: string;
}

export type OrganizationProductType =
  | "website"
  | "app"
  | "api"
  | "platform"
  | "other";

export interface OrganizationProduct {
  id: string;
  name: string;
  productType: OrganizationProductType;
  hostedUrl: string;
  description: string;
  /** GitHub repos as owner/repo */
  linkedRepos: string[];
}

/** Company profile data (wizard + extended fields) */
export interface OrganizationProfile {
  orgId: string;
  legalName: string;
  displayName: string;
  tagline: string;
  logoDataUrl: string | null;
  description: string;
  industryVertical: string;
  coreServices: string[];
  customServices: string[];
  /** Technologies & frameworks (e.g. React, Kubernetes) */
  techStacks: string[];
  products: OrganizationProduct[];
  website: string;
  linkedIn: string;
  twitter: string;
  developerSources: DeveloperEcosystemEntry[];
  headquarters: string;
  foundedYear: string;
  companySize: string;
  contactEmail: string;
  contactPhone: string;
  missionStatement: string;
  customFields: OrganizationCustomField[];
  updatedAt?: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  jobTitle: string;
  initials: string;
  joinedAt: string;
  skills: string[];
  githubUsername?: string;
  isCurrentUser?: boolean;
}

export interface UserOrgSkillBenchmark {
  skill: string;
  yourScore: number;
  roleMedian: number;
  orgTop: number;
  /** Technologies this skill maps to for stack filtering */
  techTags?: string[];
}

export interface UserOrganizationContext {
  orgId: string;
  role: OrganizationRole;
  jobTitle: string;
  memberSince: string;
  roadmapsEnrolled: number;
  roadmapsCreated: number;
  peerGroupLabel: string;
  skillBenchmarks: UserOrgSkillBenchmark[];
  developerInsight: string;
  strengthSummary: string;
  growthAreas: string[];
}
