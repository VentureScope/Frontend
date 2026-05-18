"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GitBranch, MapPinned, TrendingUp, Users } from "lucide-react";
import { SkillDistributionPieChart } from "@/components/organization/profile/SkillDistributionPieChart";
import { TechStackFilter } from "@/components/organization/profile/TechStackFilter";
import {
  ALL_TECH_FILTER,
  filterBenchmarksByTechStack,
  getOrgTechStacks,
} from "@/lib/skill-tech-stack-utils";
import type { OrganizationListItem } from "@/types/organization";
import type { UserOrganizationContext } from "@/types/organization-profile";
import { formatMemberRole } from "@/lib/organization-members-data";
import { cn } from "@/lib/utils";

type Props = {
  ctx: UserOrganizationContext;
  org: OrganizationListItem;
};

export function OrgMemberProfileSection({ ctx, org }: Props) {
  const [techFilter, setTechFilter] = useState(ALL_TECH_FILTER);
  const techStacks = useMemo(() => getOrgTechStacks(ctx.orgId), [ctx.orgId]);

  const filteredBenchmarks = useMemo(
    () => filterBenchmarksByTechStack(ctx.skillBenchmarks, techFilter),
    [ctx.skillBenchmarks, techFilter],
  );

  const techFilterLabel =
    techFilter === ALL_TECH_FILTER ? undefined : techFilter;

  return (
    <section className="space-y-6 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href={`/dashboard/organization/${ctx.orgId}`}
            className="text-lg font-semibold text-foreground hover:text-primary"
          >
            {org.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatMemberRole(ctx.role)} · {ctx.jobTitle} · Member since{" "}
            {new Date(ctx.memberSince).toLocaleDateString()}
          </p>
        </div>
        <Link
          href={`/dashboard/organization/${ctx.orgId}/members`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          View all members →
        </Link>
      </div>

      <TechStackFilter
        techStacks={techStacks}
        value={techFilter}
        onChange={setTechFilter}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Roadmaps taking",
            value: ctx.roadmapsEnrolled,
            icon: MapPinned,
          },
          {
            label: "Roadmaps created",
            value: ctx.roadmapsCreated,
            icon: TrendingUp,
          },
          {
            label: "Peer group",
            value: ctx.peerGroupLabel,
            icon: Users,
            isText: true,
          },
        ].map(({ label, value, icon: Icon, isText }) => (
          <div key={label} className="vs-surface-accent rounded-md p-4">
            <Icon className="mb-2 h-4 w-4 text-primary" />
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p
              className={cn(
                "mt-1 font-semibold text-foreground",
                isText ? "text-sm" : "text-2xl",
              )}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="vs-surface space-y-4 rounded-md p-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Skill intelligence · {ctx.peerGroupLabel}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Pie chart shows how your proficiency is distributed across skills
            {techFilterLabel ? ` in ${techFilterLabel}` : ""}. Compare against
            role median and org top in the legend.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{ctx.strengthSummary}</p>
        <SkillDistributionPieChart
          benchmarks={filteredBenchmarks}
          techFilterLabel={techFilterLabel}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="vs-surface space-y-2 rounded-md p-5">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Developer context
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {ctx.developerInsight}
          </p>
        </div>
        <div className="vs-surface space-y-3 rounded-md p-5">
          <h3 className="text-sm font-semibold text-foreground">
            Suggested growth areas
          </h3>
          <ul className="space-y-2">
            {ctx.growthAreas.map((area) => (
              <li
                key={area}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/organization/${ctx.orgId}/profile`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Company profile →
        </Link>
        <Link
          href={`/dashboard/organization/${ctx.orgId}/roadmaps`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Team roadmaps →
        </Link>
      </div>
    </section>
  );
}
