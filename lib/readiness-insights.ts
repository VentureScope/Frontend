import type { DashboardSuggestedAction } from "@/hooks/useDashboardOverview";
import type { UserReadiness } from "@/types/readiness";

export function formatRoleDemandLabel(demand: string): string {
  const normalized = demand.trim().toLowerCase();
  if (normalized === "high") return "High demand";
  if (normalized === "medium" || normalized === "moderate") return "Moderate demand";
  if (normalized === "low") return "Lower demand";
  return demand ? `${demand.charAt(0).toUpperCase()}${demand.slice(1)} demand` : "Market demand";
}

/** One-line insight for dashboard cards (not the full API summary). */
export function shortReadinessInsight(readiness: UserReadiness | null): string | null {
  if (!readiness) {
    return null;
  }

  const demand = formatRoleDemandLabel(readiness.market_context.role_demand);
  const topGaps = readiness.missing_skills.slice(0, 2);

  if (topGaps.length > 0) {
    const more =
      readiness.missing_skills.length > 2
        ? ` +${readiness.missing_skills.length - 2} more`
        : "";
    return `${readiness.level} · Focus on ${topGaps.join(", ")}${more}. ${demand}.`;
  }

  if (readiness.matched_skills.length > 0) {
    return `${readiness.overall_score}% ready · ${readiness.matched_skills.length} skills matched. ${demand}.`;
  }

  return `${readiness.overall_score}% ready · ${demand} for your target role.`;
}

export function readinessInsightHeadline(
  readiness: UserReadiness | null,
  fallback: string,
): string {
  const short = shortReadinessInsight(readiness);
  if (short) {
    return short;
  }
  return fallback;
}

export function suggestedActionsFromReadiness(
  readiness: UserReadiness | null,
): DashboardSuggestedAction[] {
  if (!readiness) {
    return [];
  }

  const actions: DashboardSuggestedAction[] = [];

  for (const [index, recommendation] of readiness.top_recommendations
    .slice(0, 3)
    .entries()) {
    const focusSkill = readiness.missing_skills[index] ?? readiness.missing_skills[0];
    actions.push({
      id: `readiness-rec-${index}`,
      title: focusSkill ? `Build ${focusSkill}` : `Recommendation ${index + 1}`,
      description: recommendation,
      href: "/dashboard/learning-path/new-roadmap",
    });
  }

  if (
    readiness.missing_skills.length > 0 &&
    actions.length < 3 &&
    !actions.some((a) => a.id === "readiness-skills")
  ) {
    actions.push({
      id: "readiness-skills",
      title: "Update your skills profile",
      description: `Add or strengthen: ${readiness.missing_skills.slice(0, 4).join(", ")}.`,
      href: "/dashboard/profile",
    });
  }

  return actions;
}

export function mergeSuggestedActions(
  primary: DashboardSuggestedAction[],
  secondary: DashboardSuggestedAction[],
  limit = 3,
): DashboardSuggestedAction[] {
  const seen = new Set<string>();
  const merged: DashboardSuggestedAction[] = [];

  for (const action of [...primary, ...secondary]) {
    if (merged.length >= limit) break;
    const key = `${action.id}-${action.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(action);
  }

  return merged;
}
