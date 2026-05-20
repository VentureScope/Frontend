import type { GeneratedResumeOut } from "@/types/generated-resume";

export type AtsLabel = "Excellent" | "Strong" | "Good" | "Needs work";

export function countResumeSkills(api: GeneratedResumeOut): number {
  const technical = api.skills?.technical?.length ?? 0;
  const soft = api.skills?.soft?.length ?? 0;
  const trending = api.trending_skills_highlighted?.length ?? 0;
  return technical + soft + trending;
}

/** Derive match score from resume completeness (not a random placeholder). */
export function computeResumeMatchScore(api: GeneratedResumeOut): number {
  let score = 35;

  if (api.professional_summary?.trim()) {
    score += 15;
  }

  const expCount = api.experience?.length ?? 0;
  if (expCount > 0) {
    score += 10 + Math.min(expCount * 4, 16);
  }

  const eduCount = api.education?.length ?? 0;
  if (eduCount > 0) {
    score += 8;
  }

  const projectCount = api.projects?.length ?? 0;
  if (projectCount > 0) {
    score += 6 + Math.min(projectCount * 3, 12);
  }

  const certCount = api.certifications?.length ?? 0;
  if (certCount > 0) {
    score += 5;
  }

  const skillCount = countResumeSkills(api);
  score += Math.min(skillCount * 2, 18);

  const warnings = api.warnings?.length ?? 0;
  score -= warnings * 4;

  return Math.round(Math.min(100, Math.max(0, score)));
}

export function computeAtsLabel(
  api: GeneratedResumeOut,
  matchScore: number,
): AtsLabel {
  const warnings = api.warnings?.length ?? 0;
  const skillCount = countResumeSkills(api);

  if (warnings >= 3 || matchScore < 50) {
    return "Needs work";
  }
  if (matchScore >= 85 && skillCount >= 8 && warnings === 0) {
    return "Excellent";
  }
  if (matchScore >= 70) {
    return "Strong";
  }
  return "Good";
}

export function resumeSectionCounts(api: GeneratedResumeOut) {
  return {
    experience: api.experience?.length ?? 0,
    education: api.education?.length ?? 0,
    projects: api.projects?.length ?? 0,
    certifications: api.certifications?.length ?? 0,
    skills: countResumeSkills(api),
  };
}

export function formatResumeSubtitle(api: GeneratedResumeOut): string {
  const counts = resumeSectionCounts(api);
  const parts = [
    `${counts.experience} experience`,
    `${counts.education} education`,
    `${counts.projects} project${counts.projects === 1 ? "" : "s"}`,
  ];
  return parts.join(" · ");
}

export function aggregateResumeAnalytics(resumes: GeneratedResumeOut[]) {
  if (resumes.length === 0) {
    return null;
  }

  const scores = resumes.map(computeResumeMatchScore);
  const avgMatch = Math.round(
    scores.reduce((a, b) => a + b, 0) / scores.length,
  );
  const withWarnings = resumes.filter((r) => (r.warnings?.length ?? 0) > 0)
    .length;
  const totalSkills = resumes.reduce((n, r) => n + countResumeSkills(r), 0);

  return {
    count: resumes.length,
    avgMatch,
    withWarnings,
    avgSkillsPerResume: Math.round(totalSkills / resumes.length),
  };
}
