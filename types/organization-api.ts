/** API DTOs aligned with OpenAPI (`api.json` organizations tag). */

export type OrganizationRoleApi = "owner" | "admin" | "member" | string;

export interface GitHubOrgEntryApi {
  name: string;
  url?: string | null;
}

export interface GitHubRepoEntryApi {
  name: string;
  url?: string | null;
}

export interface ProductEntryApi {
  name: string;
  type?: string | null;
  url?: string | null;
  repos?: string[];
}

export interface CustomFieldApi {
  id: string;
  label: string;
  value: string;
}

export interface OrganizationListItemApi {
  id: string;
  display_name: string;
  legal_name: string;
  logo_url?: string | null;
  industry?: string | null;
  member_count?: number;
  my_role: OrganizationRoleApi;
  pending_invites_count?: number;
  created_at: string;
}

export interface OrgMemberOutApi {
  user_id: string;
  full_name?: string | null;
  email: string;
  profile_picture_url?: string | null;
  role: OrganizationRoleApi;
  job_title?: string | null;
  skills?: string[] | null;
  career_interest?: string | null;
  github_username?: string | null;
  roadmaps_enrolled?: number;
  roadmaps_created?: number;
  joined_at: string;
}

export interface OrganizationOutApi {
  id: string;
  owner_id: string;
  legal_name: string;
  display_name: string;
  tagline?: string | null;
  logo_url?: string | null;
  description?: string | null;
  industry?: string | null;
  core_services?: string[] | null;
  tech_stacks?: string[] | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  github_orgs?: GitHubOrgEntryApi[] | null;
  github_repos?: GitHubRepoEntryApi[] | null;
  headquarters?: string | null;
  founded_year?: number | null;
  company_size?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  mission_statement?: string | null;
  products?: ProductEntryApi[] | null;
  custom_fields?: CustomFieldApi[] | null;
  created_at: string;
  updated_at: string;
  my_role: OrganizationRoleApi;
  member_count?: number;
  top_skills?: string[];
  top_career_interests?: string[];
  members?: OrgMemberOutApi[];
}

export interface OrganizationCreateApi {
  legal_name: string;
  display_name: string;
  tagline?: string | null;
  description?: string | null;
  industry?: string | null;
  core_services?: string[] | null;
  tech_stacks?: string[] | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  github_orgs?: GitHubOrgEntryApi[] | null;
  github_repos?: GitHubRepoEntryApi[] | null;
  headquarters?: string | null;
  founded_year?: number | null;
  company_size?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  mission_statement?: string | null;
  products?: ProductEntryApi[] | null;
  custom_fields?: CustomFieldApi[] | null;
}

export interface OrganizationUpdateApi {
  display_name?: string | null;
  tagline?: string | null;
  description?: string | null;
  industry?: string | null;
  core_services?: string[] | null;
  tech_stacks?: string[] | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  github_orgs?: GitHubOrgEntryApi[] | null;
  github_repos?: GitHubRepoEntryApi[] | null;
  headquarters?: string | null;
  founded_year?: number | null;
  company_size?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  mission_statement?: string | null;
  products?: ProductEntryApi[] | null;
  custom_fields?: CustomFieldApi[] | null;
}

export interface OrgInviteCreateApi {
  email: string;
  team_role?: string | null;
}

export interface OrgInviteOutApi {
  id: string;
  organization_id: string;
  email: string;
  team_role?: string | null;
  status: string;
  expires_at: string;
  created_at: string;
}

export interface MyInviteOutApi {
  id: string;
  organization_id: string;
  organization_name: string;
  organization_logo?: string | null;
  organization_industry?: string | null;
  team_role?: string | null;
  inviter_name?: string | null;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface InvitePreviewOutApi {
  id: string;
  organization_id: string;
  organization_name: string;
  organization_logo?: string | null;
  organization_industry?: string | null;
  organization_description?: string | null;
  team_role?: string | null;
  inviter_name?: string | null;
  expires_at: string;
  is_valid: boolean;
}

export interface AcceptInviteRequestApi {
  token: string;
}

export interface DeclineInviteRequestApi {
  token: string;
}

/** Accept may return full org, `{ organization_id }`, or empty body on 200. */
export interface AcceptInviteOutApi {
  organization_id?: string;
  id?: string;
  org_id?: string;
}

export interface MemberRoleUpdateApi {
  role: "admin" | "member";
}

export interface MyEnrollmentApi {
  enrolled: boolean;
  steps_completed?: number;
  total_steps?: number;
  completion_percentage?: number;
}

export interface OrgRoadmapAssignApi {
  trend_name: string;
  goal?: string | null;
}

export interface OrgRoadmapListItemApi {
  id: string;
  roadmap_id: string;
  title: string;
  trend_name?: string | null;
  total_weeks: number;
  total_members: number;
  aggregate_completion_percentage: number;
  created_by_user_id?: string | null;
  created_by_name?: string | null;
  my_enrollment?: MyEnrollmentApi | null;
  created_at: string;
}

export interface MemberRoadmapProgressApi {
  user_id: string;
  full_name?: string | null;
  steps_completed: number;
  total_steps: number;
  completion_percentage: number;
}

export interface OrgRoadmapOutApi {
  id: string;
  roadmap_id: string;
  title: string;
  trend_name?: string | null;
  goal?: string | null;
  total_weeks: number;
  summary?: string | null;
  created_by_user_id?: string | null;
  created_by_name?: string | null;
  total_members: number;
  members_completed: number;
  members_in_progress: number;
  aggregate_completion_percentage: number;
  per_member_progress?: MemberRoadmapProgressApi[];
  my_enrollment?: MyEnrollmentApi | null;
  created_at: string;
}

export interface OrgChatSessionCreateApi {
  title?: string;
}

export interface OrgChatSessionUpdateApi {
  title: string;
}

export interface OrgChatSessionOutApi {
  id: string;
  org_id: string;
  created_by: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface OrgChatMessageOutApi {
  id: string;
  session_id: string;
  user_id?: string | null;
  role: string;
  content: string;
  created_at: string;
}

export interface OrgChatSessionWithMessagesApi extends OrgChatSessionOutApi {
  messages?: OrgChatMessageOutApi[];
}
