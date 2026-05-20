import type { AuthUser } from "@/types/auth";

export function parseCareerInterests(value: string | null | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }
  return Array.from(
    new Set(
      value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

export function portfolioFromSocialLinks(
  user: AuthUser | null | undefined,
): string | null {
  const links = user?.social_links;
  if (!links || typeof links !== "object") {
    return null;
  }
  const record = links as Record<string, unknown>;
  for (const key of ["portfolio", "website", "linkedin", "url"]) {
    const v = record[key];
    if (typeof v === "string" && v.trim().startsWith("http")) {
      return v.trim();
    }
  }
  return null;
}

export function accountRoleLabel(role: string | null | undefined): string {
  if (!role) {
    return "Member";
  }
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function oauthProviderLabel(
  provider: string | null | undefined,
): string {
  if (!provider) {
    return "Email & password";
  }
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}
