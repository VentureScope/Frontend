import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import type {
  ResumeEditorSection,
  ResumeUpdateRequest,
} from "@/types/generated-resume";

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseLineList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildResumeSectionPatch(
  section: ResumeEditorSection,
  resume: Resume,
): ResumeUpdateRequest {
  switch (section) {
    case "target":
      return {
        target_role: resume.title.trim() || resume.title,
        professional_summary: resume.content.summary.trim(),
      };
    case "skills":
      return {
        skills: {
          technical: resume.technicalSkills ?? [],
          soft: resume.softSkills ?? [],
        },
        trending_skills_highlighted: resume.trendingSkills ?? [],
      };
    case "experience":
      return {
        experience: resume.content.experience.map((e) => ({
          company: e.company.trim(),
          role: e.role.trim(),
          duration: e.duration.trim() || null,
          highlights: e.description.filter((h) => h.trim().length > 0),
        })),
      };
    case "education":
      return {
        education: resume.content.education.map((e) => ({
          institution: e.school.trim(),
          degree: e.degree.trim(),
          field: e.field?.trim() || null,
          year: e.year.trim() || null,
        })),
      };
    case "projects":
      return {
        projects: resume.content.projects.map((p) => ({
          name: p.name.trim(),
          description: p.description.trim() || null,
          technologies: p.technologies,
        })),
      };
    case "certifications":
      return {
        certifications: resume.content.certifications.map((c) => ({
          name: c.name.trim(),
          issuer: c.issuer?.trim() || null,
          year: c.year?.trim() || null,
        })),
      };
    default:
      return {};
  }
}

export function skillsFromCommaInputs(
  technicalRaw: string,
  softRaw: string,
  trendingRaw: string,
): Pick<Resume, "technicalSkills" | "softSkills" | "trendingSkills"> {
  return {
    technicalSkills: parseCommaList(technicalRaw),
    softSkills: parseCommaList(softRaw),
    trendingSkills: parseCommaList(trendingRaw),
  };
}

export function highlightsToText(lines: string[]): string {
  return lines.join("\n");
}

export function textToHighlights(text: string): string[] {
  return parseLineList(text);
}

export function technologiesToText(tech: string[]): string {
  return tech.join(", ");
}

export function textToTechnologies(text: string): string[] {
  return parseCommaList(text);
}
