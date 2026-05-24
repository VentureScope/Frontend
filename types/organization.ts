export type OrganizationRole = "owner" | "admin" | "member";

export interface OrganizationListItem {
  id: string;
  name: string;
  role: OrganizationRole;
  memberCount: number;
  /** Roadmap count; populated in a later phase (0 until wired). */
  activeProjects: number;
  logoUrl?: string | null;
  memberAvatars: { initials: string }[];
  extraMemberCount?: number;
}
