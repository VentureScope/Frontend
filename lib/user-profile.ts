import { AuthUser } from "@/types/auth";

export interface UserProfileView {
  fullName: string;
  firstName: string;
  email: string;
  role: string;
  careerInterest: string;
  githubUsername: string | null;
  location: string;
  timezone: string;
  avatarUrl: string;
}

const DEFAULT_PROFILE: Omit<UserProfileView, "avatarUrl"> = {
  fullName: "Career Explorer",
  firstName: "Explorer",
  email: "No email available",
  role: "Professional",
  careerInterest: "Career Growth",
  githubUsername: null,
  location: "Location not set",
  timezone: "Local Time",
};

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getFirstNonEmptyString(
  user: AuthUser | null | undefined,
  keys: string[],
): string | null {
  if (!user) {
    return null;
  }

  for (const key of keys) {
    const candidate = asNonEmptyString(user[key]);
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

function toTitleCase(input: string): string {
  return input
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function fallbackNameFromEmail(email: string): string {
  const local = email.split("@")[0] || "Explorer";
  return toTitleCase(local.replace(/[._-]+/g, " "));
}

export function getUserProfileView(
  user: AuthUser | null | undefined,
): UserProfileView {
  const email =
    getFirstNonEmptyString(user, ["email", "primary_email"]) ||
    DEFAULT_PROFILE.email;

  const fullName =
    getFirstNonEmptyString(user, ["full_name", "fullName", "name"]) ||
    (email.includes("@")
      ? fallbackNameFromEmail(email)
      : DEFAULT_PROFILE.fullName);

  const firstName = fullName.split(/\s+/)[0] || DEFAULT_PROFILE.firstName;

  const role =
    getFirstNonEmptyString(user, ["role", "job_title", "title"]) ||
    DEFAULT_PROFILE.role;

  const careerInterest =
    getFirstNonEmptyString(user, ["career_interest", "careerInterest"]) ||
    DEFAULT_PROFILE.careerInterest;

  const githubUsername = getFirstNonEmptyString(user, [
    "github_username",
    "githubUsername",
  ]);

  const location =
    getFirstNonEmptyString(user, ["location", "city", "country"]) ||
    DEFAULT_PROFILE.location;

  const timezone =
    getFirstNonEmptyString(user, ["timezone", "tz"]) ||
    DEFAULT_PROFILE.timezone;

  const profilePictureUrl = getFirstNonEmptyString(user, [
    "profile_picture_url",
  ]);

  const avatarSeed = encodeURIComponent(fullName || email || "explorer");

  return {
    fullName,
    firstName,
    email,
    role,
    careerInterest,
    githubUsername,
    location,
    timezone,
    avatarUrl: profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
  };
}
