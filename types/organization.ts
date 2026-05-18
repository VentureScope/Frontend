export type OrganizationRole = "owner" | "admin" | "member";

export interface OrganizationListItem {
  id: string;
  name: string;
  role: OrganizationRole;
  memberCount: number;
  activeProjects: number;
  memberAvatars: { initials: string }[];
  extraMemberCount?: number;
}
