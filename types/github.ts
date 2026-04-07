export interface GitHubContributionSummary {
  total_contributions?: number;
  total_pull_requests?: number;
  total_issue_contributions?: number;
  total_repositories_with_contributed_commits?: number;
}

export interface GitHubLanguageBreakdown {
  name: string;
  size: number;
}

export interface GitHubRepositorySummary {
  name: string;
  description?: string | null;
  stargazer_count?: number;
  fork_count?: number;
  is_private?: boolean;
  is_fork?: boolean;
  pushed_at?: string | null;
  updated_at?: string | null;
  primary_language?: string | null;
  languages?: GitHubLanguageBreakdown[] | null;
  topics?: string[] | null;
}

export interface GitHubProfileSyncResponse {
  status: string;
  message: string;
  github_connected?: boolean;
  github_username?: string | null;
  full_name?: string | null;
  profile_picture_url?: string | null;
  required_scopes?: string[] | null;
  authorization_url?: string | null;
  state?: string | null;
  repositories?: GitHubRepositorySummary[] | null;
  contributions?: GitHubContributionSummary | null;
}

export interface GitHubSyncedDataResponse {
  github_username?: string | null;
  repositories?: GitHubRepositorySummary[] | null;
  contributions?: GitHubContributionSummary | null;
  organizations?: Record<string, unknown>[] | null;
  synced_at: string;
}
