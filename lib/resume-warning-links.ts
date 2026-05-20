export type ResumeWarningLink = {
  label: string;
  href: string;
};

type WarningRule = {
  patterns: RegExp[];
  label: string;
  href: string;
};

/** Map API warning strings (often containing endpoint paths) to in-app destinations. */
const WARNING_RULES: WarningRule[] = [
  {
    patterns: [/experiences?/i, /\/api\/users\/me\/experiences/],
    label: "Work experience",
    href: "/dashboard/profile",
  },
  {
    patterns: [/skills?/i, /\/api\/users\/me\/skills/],
    label: "Skills",
    href: "/dashboard/profile",
  },
  {
    patterns: [/github/i, /\/api\/users\/me\/github/],
    label: "GitHub",
    href: "/dashboard/data-hub",
  },
  {
    patterns: [/transcript/i, /\/api\/transcripts/],
    label: "Academic transcript",
    href: "/dashboard/data-hub",
  },
  {
    patterns: [/\/api\/users\/me\/cv\b/i, /\bcv\b/i, /resume file/i],
    label: "CV upload",
    href: "/dashboard/data-hub",
  },
  {
    patterns: [/career_interest/i, /career interest/i],
    label: "Career interests",
    href: "/dashboard/profile",
  },
  {
    patterns: [/profile[- ]?picture/i, /\/api\/users\/me\/profile-picture/],
    label: "Profile photo",
    href: "/dashboard/profile",
  },
  {
    patterns: [/education/i, /gpa/i, /degree/i],
    label: "Education",
    href: "/dashboard/data-hub",
  },
  {
    patterns: [/professional.?summary/i, /summary/i],
    label: "Profile details",
    href: "/dashboard/profile",
  },
  {
    patterns: [/\/api\/users\/me\b/i],
    label: "Profile",
    href: "/dashboard/profile",
  },
];

function stripApiPaths(text: string): string {
  return text
    .replace(/\(?(?:GET|POST|PUT|PATCH|DELETE)\s+\/api\/[^\s)]+/gi, "")
    .replace(/\(?\/api\/[^\s)]+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/^[\s:–—-]+/, "")
    .replace(/[\s:–—-]+$/, "");
}

export function parseResumeWarning(warning: string): ResumeWarningLink {
  const normalized = warning.trim();

  for (const rule of WARNING_RULES) {
    if (rule.patterns.some((p) => p.test(normalized))) {
      return { label: rule.label, href: rule.href };
    }
  }

  const cleaned = stripApiPaths(normalized);
  return {
    label: cleaned.length > 0 ? cleaned : "Complete your profile",
    href: "/dashboard/data-hub",
  };
}

export function parseResumeWarnings(warnings: string[]): ResumeWarningLink[] {
  const seen = new Set<string>();
  const links: ResumeWarningLink[] = [];

  for (const warning of warnings) {
    const link = parseResumeWarning(warning);
    const key = `${link.href}::${link.label}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    links.push(link);
  }

  return links;
}

export function formatResumeWarningSummary(
  warnings: string[],
  maxItems = 2,
): string {
  return parseResumeWarnings(warnings)
    .slice(0, maxItems)
    .map((l) => l.label)
    .join(" · ");
}
