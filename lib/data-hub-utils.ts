import type { AuthUser, Experience } from "@/types/auth";
import type { GitHubSyncedDataResponse } from "@/types/github";
import type { TranscriptResponse } from "@/types/transcript";

export type DataSourceStatus = "synced" | "not_connected";

export interface DataHubSourceStatus {
  id: "github" | "transcript" | "cv" | "skills";
  label: string;
  status: DataSourceStatus;
  detail: string;
}

export function isGithubSynced(
  data: GitHubSyncedDataResponse | null,
  user?: AuthUser | null,
): boolean {
  return !!(
    data?.github_username ||
    user?.github_username ||
    (data?.repositories?.length ?? 0) > 0
  );
}

export function isTranscriptSynced(
  transcript: TranscriptResponse | null,
): boolean {
  return (transcript?.transcript_data?.semesters?.length ?? 0) > 0;
}

export function isCvSynced(profile: AuthUser | null): boolean {
  return typeof profile?.cv_url === "string" && profile.cv_url.length > 0;
}

export function isSkillsSynced(
  profile: AuthUser | null,
  experiences: Experience[],
): boolean {
  const skills = profile?.skills ?? [];
  return skills.length > 0 || experiences.length > 0;
}

export function buildDataHubSources(input: {
  github: GitHubSyncedDataResponse | null;
  transcript: TranscriptResponse | null;
  profile: AuthUser | null;
  experiences: Experience[];
}): DataHubSourceStatus[] {
  const githubOk = isGithubSynced(input.github, input.profile);
  const transcriptOk = isTranscriptSynced(input.transcript);
  const cvOk = isCvSynced(input.profile);
  const skillsOk = isSkillsSynced(input.profile, input.experiences);

  const repoCount = input.github?.repositories?.length ?? 0;
  const semesterCount =
    input.transcript?.transcript_data?.semesters?.length ?? 0;
  const skillCount = input.profile?.skills?.length ?? 0;

  return [
    {
      id: "github",
      label: "GitHub",
      status: githubOk ? "synced" : "not_connected",
      detail: githubOk
        ? `${repoCount} repo${repoCount === 1 ? "" : "s"} synced`
        : "Connect to import projects",
    },
    {
      id: "transcript",
      label: "Academic transcript",
      status: transcriptOk ? "synced" : "not_connected",
      detail: transcriptOk
        ? `${semesterCount} semester${semesterCount === 1 ? "" : "s"} on file`
        : "Use extension to extract grades",
    },
    {
      id: "cv",
      label: "CV / Resume file",
      status: cvOk ? "synced" : "not_connected",
      detail: cvOk ? "Document uploaded" : "Upload PDF, DOC, or DOCX",
    },
    {
      id: "skills",
      label: "Skills & experience",
      status: skillsOk ? "synced" : "not_connected",
      detail: skillsOk
        ? `${skillCount} skills · ${input.experiences.length} roles`
        : "Add skills or work history",
    },
  ];
}

export function computeHubCompletionPercent(
  sources: DataHubSourceStatus[],
): number {
  if (sources.length === 0) {
    return 0;
  }
  const synced = sources.filter((s) => s.status === "synced").length;
  return Math.round((synced / sources.length) * 100);
}

export function formatHubTimestamp(iso: string | null | undefined): string {
  if (!iso) {
    return "Never";
  }
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) {
    return "Unknown";
  }
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
