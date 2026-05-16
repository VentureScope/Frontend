/** Resume payloads from `GET/POST /api/resume*` (OpenAPI `ResumeOut`). */

export interface SkillSection {
  technical?: string[];
  soft?: string[];
}

export interface ExperienceSection {
  company: string;
  role: string;
  duration?: string | null;
  highlights?: string[];
}

export interface EducationSection {
  institution: string;
  degree: string;
  field?: string | null;
  year?: string | null;
}

export interface ProjectSection {
  name: string;
  description?: string | null;
  technologies?: string[];
}

export interface GeneratedResumeOut {
  id: string;
  user_id: string;
  target_role: string;
  professional_summary?: string | null;
  skills?: SkillSection | null;
  experience?: ExperienceSection[];
  education?: EducationSection[];
  projects?: ProjectSection[];
  certifications?: { name: string; issuer?: string | null; year?: string | null }[];
  trending_skills_highlighted?: string[];
  created_at: string;
}
