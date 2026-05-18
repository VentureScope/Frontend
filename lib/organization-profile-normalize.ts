import type { OrganizationProfile } from "@/types/organization-profile";

const EMPTY_DEFAULTS: Omit<OrganizationProfile, "orgId"> = {
  legalName: "",
  displayName: "",
  tagline: "",
  logoDataUrl: null,
  description: "",
  industryVertical: "",
  coreServices: [],
  customServices: [],
  techStacks: [],
  products: [],
  website: "",
  linkedIn: "",
  twitter: "",
  developerSources: [],
  headquarters: "",
  foundedYear: "",
  companySize: "",
  contactEmail: "",
  contactPhone: "",
  missionStatement: "",
  customFields: [],
};

export function normalizeOrganizationProfile(
  profile: Partial<OrganizationProfile> & { orgId: string },
): OrganizationProfile {
  return {
    ...EMPTY_DEFAULTS,
    ...profile,
    orgId: profile.orgId,
    techStacks: profile.techStacks ?? [],
    products: profile.products ?? [],
    developerSources: profile.developerSources ?? [],
    customFields: profile.customFields ?? [],
    coreServices: profile.coreServices ?? [],
    customServices: profile.customServices ?? [],
  };
}
