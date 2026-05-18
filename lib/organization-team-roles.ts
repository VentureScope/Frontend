/** Team / job roles assignable when inviting a member */
export const TEAM_ROLE_OPTIONS = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Platform Engineer",
  "Mobile Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Security Engineer",
  "Product Designer",
  "Product Manager",
  "Engineering Manager",
  "Technical Lead",
  "QA Engineer",
] as const;

export type TeamRoleOption = (typeof TEAM_ROLE_OPTIONS)[number];

export const TEAM_ROLE_GROUPS: { label: string; roles: TeamRoleOption[] }[] = [
  {
    label: "Engineering",
    roles: [
      "Frontend Engineer",
      "Backend Engineer",
      "Full Stack Engineer",
      "Platform Engineer",
      "Mobile Engineer",
    ],
  },
  {
    label: "Data & ML",
    roles: [
      "Data Engineer",
      "Data Scientist",
      "Machine Learning Engineer",
    ],
  },
  {
    label: "Infrastructure",
    roles: ["DevOps Engineer", "Site Reliability Engineer"],
  },
  {
    label: "Quality & security",
    roles: ["QA Engineer", "Security Engineer"],
  },
  {
    label: "Leadership & product",
    roles: [
      "Engineering Manager",
      "Technical Lead",
      "Product Designer",
      "Product Manager",
    ],
  },
];

export function getTeamRoleSelectOptions(): { value: string; label: string }[] {
  return TEAM_ROLE_OPTIONS.map((role) => ({ value: role, label: role }));
}
