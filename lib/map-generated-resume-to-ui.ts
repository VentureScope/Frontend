import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import type { GeneratedResumeOut } from "@/types/generated-resume";

function formatRelativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) {
    return "Recently";
  }
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) {
    return "Just now";
  }
  if (mins < 60) {
    return `${mins} min ago`;
  }
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) {
    return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  }
  return new Date(iso).toLocaleDateString();
}

export function generatedResumeToListingResume(
  api: GeneratedResumeOut,
): Resume {
  const skills = api.skills
    ? [...(api.skills.technical ?? []), ...(api.skills.soft ?? [])]
    : api.trending_skills_highlighted ?? [];

  const experience =
    api.experience?.map((e, i) => ({
      id: `exp-${i}`,
      role: e.role,
      company: e.company,
      duration: e.duration || "",
      description: e.highlights?.length ? e.highlights : [""],
    })) ?? [];

  const education =
    api.education?.map((ed, i) => ({
      id: `edu-${i}`,
      degree: ed.degree,
      school: ed.institution,
      year: ed.year || "",
    })) ?? [];

  const projectSummary =
    api.projects && api.projects.length > 0
      ? "\n\n" +
        api.projects
          .map((p) =>
            [p.name, p.description, (p.technologies ?? []).join(", ")]
              .filter(Boolean)
              .join(" — "),
          )
          .join("\n")
      : "";

  const summary =
    (api.professional_summary || `Target role: ${api.target_role}.`) +
    projectSummary;

  return {
    id: api.id,
    title: api.target_role,
    company: "Generated resume",
    lastUpdated: formatRelativeTime(api.created_at),
    matchScore: skills.length ? Math.min(99, 70 + Math.min(skills.length, 12)) : 72,
    atsStatus: skills.length >= 8 ? "Strong" : "Good",
    tags: (api.trending_skills_highlighted ?? []).slice(0, 3),
    isRecent: Date.now() - new Date(api.created_at).getTime() < 86400000,
    content: {
      summary,
      experience:
        experience.length > 0
          ? experience
          : [
              {
                id: "placeholder",
                role: api.target_role,
                company: "—",
                duration: "",
                description: ["Add experience in your profile to enrich this section."],
              },
            ],
      education:
        education.length > 0
          ? education
          : [
              {
                id: "edu-placeholder",
                degree: "—",
                school: "—",
                year: "",
              },
            ],
      skills: skills.length > 0 ? skills : ["Skills pending"],
    },
  };
}
