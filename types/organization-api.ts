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

export interface OrganizationListItemApi {
  id: string;
  display_name: string;
  legal_name: string;
  logo_url?: string | null;
  industry?: string | null;
  member_count?: number;
  my_role: OrganizationRoleApi;
  created_at: string;
}

export interface OrgMemberOutApi {
  user_id: string;
  full_name?: string | null;
  email: string;
  profile_picture_url?: string | null;
  role: OrganizationRoleApi;
  skills?: string[] | null;
  career_interest?: string | null;
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
  website_url?: string | null;
  linkedin_url?: string | null;
  github_orgs?: GitHubOrgEntryApi[] | null;
  github_repos?: GitHubRepoEntryApi[] | null;
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
  website_url?: string | null;
  linkedin_url?: string | null;
  github_orgs?: GitHubOrgEntryApi[] | null;
  github_repos?: GitHubRepoEntryApi[] | null;
}

export interface OrganizationUpdateApi {
  display_name?: string | null;
  tagline?: string | null;
  description?: string | null;
  industry?: string | null;
  core_services?: string[] | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  github_orgs?: GitHubOrgEntryApi[] | null;
  github_repos?: GitHubRepoEntryApi[] | null;
}

export interface OrgInviteCreateApi {
  email: string;
}

export interface OrgInviteOutApi {
  id: string;
  organization_id: string;
  email: string;
  status: string;
  expires_at: string;
  created_at: string;
}

export interface AcceptInviteRequestApi {
  token: string;
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
  total_members: number;
  members_completed: number;
  members_in_progress: number;
  aggregate_completion_percentage: number;
  per_member_progress?: MemberRoadmapProgressApi[];
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
