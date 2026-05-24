/** True when `goal` is the org wizard generation prompt, not a user-facing goal. */
export function isInternalOrgRoadmapGoal(
  goal: string | null | undefined,
): boolean {
  if (!goal?.trim()) {
    return false;
  }
  const g = goal.trim();
  return (
    /^Organization:/i.test(g) ||
    /Focus practice area:/i.test(g) ||
    /Generate a team learning roadmap/i.test(g) ||
    /Company-wide technologies:/i.test(g) ||
    /Team in this area \(/i.test(g) ||
    /Prioritize organization and team context over generic market trends/i.test(
      g,
    )
  );
}

function stripBulletPrefix(line: string): string {
  return line
    .replace(/^[-•*–—]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .trim();
}

/** Split API summary text into display bullet items. */
export function parseRoadmapSummaryBullets(
  summary: string | null | undefined,
): string[] {
  if (!summary?.trim()) {
    return [];
  }

  const raw = summary.trim();

  const lines = raw
    .split(/\r?\n+/)
    .map((line) => stripBulletPrefix(line.trim()))
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  const singleLine = lines[0] ?? raw;
  const inlineParts = singleLine
    .split(/\s+(?=[-•*–—]\s)|(?:^|\s)(?=\d+[.)]\s)/)
    .map((part) => stripBulletPrefix(part.trim()))
    .filter(Boolean);

  if (inlineParts.length > 1) {
    return inlineParts;
  }

  const sentences = singleLine
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length > 1) {
    return sentences;
  }

  return [singleLine];
}

export function displayRoadmapGoal(
  goal: string | null | undefined,
): string | null {
  if (!goal?.trim() || isInternalOrgRoadmapGoal(goal)) {
    return null;
  }
  return goal.trim();
}
