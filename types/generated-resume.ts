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

export interface CertificationSection {
  name: string;
  issuer?: string | null;
  year?: string | null;
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
  certifications?: CertificationSection[];
  trending_skills_highlighted?: string[];
  created_at: string;
  updated_at?: string | null;
  warnings?: string[];
}

export interface ResumeUpdateRequest {
  target_role?: string | null;
  professional_summary?: string | null;
  skills?: SkillSection | null;
  experience?: ExperienceSection[] | null;
  education?: EducationSection[] | null;
  projects?: ProjectSection[] | null;
  certifications?: CertificationSection[] | null;
  trending_skills_highlighted?: string[] | null;
}

export type ResumeEditorSection =
  | "target"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "certifications";
