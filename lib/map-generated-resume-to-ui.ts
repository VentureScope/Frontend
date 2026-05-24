import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import type { GeneratedResumeOut } from "@/types/generated-resume";
import {
  computeAtsLabel,
  computeResumeMatchScore,
  formatResumeSubtitle,
} from "@/lib/resume-utils";

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

function flattenSkills(api: GeneratedResumeOut): string[] {
  const technical = api.skills?.technical ?? [];
  const soft = api.skills?.soft ?? [];
  const trending = api.trending_skills_highlighted ?? [];
  const merged = [...technical, ...soft, ...trending];
  return [...new Set(merged.map((s) => s.trim()).filter(Boolean))];
}

export function generatedResumeToListingResume(
  api: GeneratedResumeOut,
): Resume {
  const technicalSkills = api.skills?.technical ?? [];
  const softSkills = api.skills?.soft ?? [];
  const trendingSkills = api.trending_skills_highlighted ?? [];
  const allSkills = flattenSkills(api);

  const experience =
    api.experience?.map((e, i) => ({
      id: `exp-${i}`,
      role: e.role,
      company: e.company,
      duration: e.duration || "",
      description:
        e.highlights?.filter((h) => h.trim().length > 0) ?? [],
    })) ?? [];

  const education =
    api.education?.map((ed, i) => ({
      id: `edu-${i}`,
      degree: ed.degree,
      school: ed.institution,
      year: ed.year || "",
      field: ed.field || undefined,
    })) ?? [];

  const projects =
    api.projects?.map((p, i) => ({
      id: `proj-${i}`,
      name: p.name,
      description: p.description || "",
      technologies: p.technologies ?? [],
    })) ?? [];

  const certifications =
    api.certifications?.map((c, i) => ({
      id: `cert-${i}`,
      name: c.name,
      issuer: c.issuer || undefined,
      year: c.year || undefined,
    })) ?? [];

  const matchScore = computeResumeMatchScore(api);
  const warnings = api.warnings ?? [];

  const professionalSummary =
    api.professional_summary?.trim() ||
    (warnings.length > 0
      ? `Resume for ${api.target_role}. Complete your profile to enrich missing sections.`
      : `Resume tailored for ${api.target_role}.`);

  return {
    id: api.id,
    title: api.target_role,
    company: formatResumeSubtitle(api),
    lastUpdated: formatRelativeTime(api.updated_at ?? api.created_at),
    createdAt: api.created_at,
    updatedAt: api.updated_at ?? api.created_at,
    matchScore,
    atsStatus: computeAtsLabel(api, matchScore),
    tags: trendingSkills.slice(0, 4),
    isRecent:
      Date.now() - new Date(api.updated_at ?? api.created_at).getTime() <
      86400000,
    warnings,
    technicalSkills,
    softSkills,
    trendingSkills,
    content: {
      summary: professionalSummary,
      experience,
      education,
      projects,
      certifications,
      skills: allSkills.length > 0 ? allSkills : [],
    },
  };
}
