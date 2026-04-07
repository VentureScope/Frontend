export interface CourseSchema {
  code: string;
  title: string;
  credit_hours: number;
  grade: string;
  points?: number | null;
}

export interface CumulativeSummarySchema {
  credit_hours: number;
  points?: number;
  cgpa: number;
}

export interface SemesterSummarySchema {
  credit_hours: number;
  points?: number;
  sgpa: number;
  academic_status?: string | null;
}

export interface SemesterSchema {
  academic_year: string;
  semester: string;
  year_level?: string | null;
  courses: CourseSchema[];
  semester_summary: SemesterSummarySchema;
  cumulative_summary: CumulativeSummarySchema;
}

export interface TranscriptDataSchema {
  semesters: SemesterSchema[];
}

export interface TranscriptResponse {
  id: string;
  user_id: string;
  version: number;
  transcript_data: TranscriptDataSchema;
  created_at: string;
  updated_at: string;
}

export interface TranscriptConfigResponse {
  id: string;
  user_id: string;
  gpa_scale: number;
  grading_schema: Record<string, number | null>;
  grade_display_order: string[];
  created_at: string;
  updated_at: string;
}
