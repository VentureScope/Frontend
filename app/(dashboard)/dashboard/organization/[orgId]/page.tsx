import Link from "next/link";
import { ArrowLeft, MapPinned, Bot, Building2, UserCircle } from "lucide-react";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";

function orgHref(orgId: string, segment: string) {
  return `/dashboard/organization/${orgId}/${segment}`;
}

const ORG_LINKS: {
  name: string;
  description: string;
  icon: typeof MapPinned;
  href: (orgId: string) => string;
}[] = [
  {
    name: "Company profile",
    description: "Legal identity, industry, services, and company details",
    icon: Building2,
    href: (id) => orgHref(id, "profile"),
  },
  {
    name: "Members",
    description: "Teammates, roles, and invitations",
    icon: UserCircle,
    href: (id) => orgHref(id, "members"),
  },
  {
    name: "Team roadmaps",
    description: "Shared learning paths for the organization",
    icon: MapPinned,
    href: (id) => orgHref(id, "roadmaps"),
  },
  {
    name: "Org Advisor",
    description: "AI guidance in your company context",
    icon: Bot,
    href: () => "/dashboard/organization/advisor",
  },
];

function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function OrganizationDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);
  const displayName = org?.name ?? nameFromSlug(orgId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/dashboard/organization"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All organizations
      </Link>

      <header className="mb-8 space-y-2">
        <h1 className="text-h1 text-foreground">{displayName}</h1>
        <p className="text-body text-muted-foreground">
          Manage this organization’s company profile and members, collaborate on
          team roadmaps, or consult the org advisor.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ORG_LINKS.map((item) => (
          <Link
            key={item.name}
            href={item.href(orgId)}
            className="vs-surface-accent flex flex-col gap-3 rounded-md p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="vs-icon-tile-primary flex h-10 w-10 items-center justify-center rounded-md">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {item.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
