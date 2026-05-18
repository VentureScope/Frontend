export type CreateOrganizationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const WIZARD_STEP_COUNT = 8;

export type DeveloperSourceKind = "organization" | "repository";

export type DeveloperSourceVisibility = "public" | "private";

export interface DeveloperEcosystemEntry {
  id: string;
  kind: DeveloperSourceKind;
  /** GitHub org slug or `owner/repo` */
  identifier: string;
  visibility: DeveloperSourceVisibility;
  /** OAuth linked — required for orgs and private repos; public repos skip this */
  connected: boolean;
}

export interface OrganizationCreateForm {
  legalName: string;
  displayName: string;
  tagline: string;
  logoDataUrl: string | null;
  description: string;
  industryVertical: string;
  coreServices: string[];
  customServices: string[];
  website: string;
  linkedIn: string;
  twitter: string;
  developerSources: DeveloperEcosystemEntry[];
}

export const EMPTY_ORGANIZATION_CREATE_FORM: OrganizationCreateForm = {
  legalName: "",
  displayName: "",
  tagline: "",
  logoDataUrl: null,
  description: "",
  industryVertical: "",
  coreServices: [],
  customServices: [],
  website: "",
  linkedIn: "",
  twitter: "",
  developerSources: [],
};
