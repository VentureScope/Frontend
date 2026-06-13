import type { AuthUser } from "@/types/auth";
import {
  accountRoleLabel,
  oauthProviderLabel,
  parseCareerInterests,
  portfolioFromSocialLinks,
} from "@/lib/settings-utils";
import { getUserProfileView } from "@/lib/user-profile";

type SettingsAccountInfoProps = {
  user: AuthUser | null;
};

export function SettingsAccountInfo({ user }: SettingsAccountInfoProps) {
  const profile = getUserProfileView(user);
  const interests = parseCareerInterests(user?.career_interest as string);
  const portfolio = portfolioFromSocialLinks(user);
  const skillCount = user?.skills?.length ?? 0;
  const hasCv = Boolean(user?.cv_url);

  const rows = [
    { label: "Email", value: profile.email },
    {
      label: "Sign-in method",
      value: oauthProviderLabel(user?.oauth_provider as string),
    },
    {
      label: "Account type",
      value: accountRoleLabel(user?.role as string),
    },
    {
      label: "GitHub",
      value: profile.githubUsername ? `@${profile.githubUsername}` : "Not linked",
    },
    {
      label: "Career interests",
      value:
        interests.length > 0 ? interests.join(", ") : "None set",
    },
    {
      label: "Skills on profile",
      value: skillCount > 0 ? `${skillCount} listed` : "None listed",
    },
    { label: "CV uploaded", value: hasCv ? "Yes" : "No" },
    ...(portfolio ? [{ label: "Portfolio", value: portfolio }] : []),
  ];

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
      <p className="text-label text-primary">Account overview</p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {row.label}
            </dt>
            <dd className="mt-1 break-all text-sm font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
