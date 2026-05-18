import type { OrganizationListItem } from "@/types/organization";

export const ORG_ADVISOR_QUICK_PROMPTS = [
  {
    id: "hiring",
    label: "Hiring priorities",
    prompt:
      "Based on our services and tech stack, what roles should we prioritize hiring for in the next quarter?",
    icon: "users" as const,
  },
  {
    id: "upskill",
    label: "Upskilling plan",
    prompt:
      "Which skills gaps should we address across the team, and what learning roadmaps would you recommend?",
    icon: "trending" as const,
  },
  {
    id: "roadmaps",
    label: "Roadmap alignment",
    prompt:
      "How well do our active team roadmaps align with our stated products and engineering goals?",
    icon: "map" as const,
  },
  {
    id: "workforce",
    label: "Workforce planning",
    prompt:
      "Help me think through capacity planning for our engineering organization over the next 6 months.",
    icon: "calendar" as const,
  },
];

export function mockOrgAdvisorReply(
  userMessage: string,
  org: OrganizationListItem | null,
): string {
  const orgName = org?.name ?? "your organization";
  const lower = userMessage.toLowerCase();

  if (lower.includes("hiring") || lower.includes("recruit")) {
    return `For **${orgName}**, I'd start by mapping open initiatives to the services on your company profile—especially where roadmap enrollment is high but bench depth looks thin.

**Suggested priorities**
1. **Platform / backend** — if multiple roadmaps depend on shared APIs or infra.
2. **Full-stack product engineers** — to own end-to-end delivery on your listed products.
3. **Data or ML** — only if product strategy explicitly requires it this quarter.

**Next step:** Compare member skill benchmarks in My Org Profile against the tech stack you've declared. I can help draft role descriptions once you share target team size.`;
  }

  if (lower.includes("skill") || lower.includes("upskill") || lower.includes("gap")) {
    return `Looking at **${orgName}** in context, upskilling works best when tied to roadmaps people are already taking—not generic training catalogs.

**Approach**
- Identify skills where several members sit **below role median** on the same tech stack filter.
- Publish **one org roadmap per gap** (e.g. Kubernetes, TypeScript depth) instead of many overlapping paths.
- Pair public GitHub repos from your developer integrations with weekly milestones.

Tell me a specific team or technology and I'll outline a 4-week enablement sequence.`;
  }

  if (lower.includes("roadmap")) {
    return `For **${orgName}**, roadmap alignment is strongest when each path maps to a **product** on your company profile and at least one **linked repository**.

**Quick audit checklist**
- Does every active team roadmap have a clear owner and enrolled members?
- Do roadmap topics match your declared **services** (e.g. platform, data, security)?
- Are contributors' personal progress percentages updating weekly?

I recommend opening Team Roadmaps, filtering "Created by me," and listing any path with zero enrollments—that usually signals misalignment early.`;
  }

  if (lower.includes("workforce") || lower.includes("capacity") || lower.includes("planning")) {
    return `Workforce planning for **${orgName}** should balance **roadmap load**, **hiring pipeline**, and **member role distribution**.

**Framework**
1. **Demand** — sum of enrolled roadmaps × average modules per path.
2. **Supply** — active members by role (owner/admin vs member) and their skill benchmarks.
3. **Risk** — single points of failure on critical products or GitHub orgs.

Share your target delivery date or headcount constraint and I can suggest a phased staffing scenario.`;
  }

  return `I'm here to help **${orgName}** with organization-level decisions—not individual career coaching (use **AI Advisor** in the workspace for that).

I can assist with:
- **Hiring & role design** aligned to your services and tech stack
- **Upskilling & roadmap strategy** for teams and departments
- **Workforce & capacity planning** using member and roadmap signals
- **Product ↔ engineering alignment** using your company profile

What would you like to focus on first? You can also tap a suggested prompt on the left to get started.`;
}
