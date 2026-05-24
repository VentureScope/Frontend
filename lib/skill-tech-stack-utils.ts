import type { UserOrgSkillBenchmark } from "@/types/organization-profile";

export const ALL_TECH_FILTER = "all";

export function getOrgTechStacks(techStacks: string[] | undefined | null): string[] {
  return techStacks?.filter(Boolean) ?? [];
}

export function filterBenchmarksByTechStack(
  benchmarks: UserOrgSkillBenchmark[],
  techFilter: string,
): UserOrgSkillBenchmark[] {
  if (techFilter === ALL_TECH_FILTER) {
    return benchmarks;
  }

  const needle = techFilter.toLowerCase();

  return benchmarks.filter((b) => {
    if (b.techTags?.some((t) => t.toLowerCase() === needle)) {
      return true;
    }
    if (b.skill.toLowerCase().includes(needle)) {
      return true;
    }
    return false;
  });
}
