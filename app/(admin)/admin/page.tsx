"use client";

import {
  Activity,
  Building2,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

const STATS = [
  {
    label: "Total users",
    value: "—",
    hint: "Connect backend to load live counts",
    icon: Users,
  },
  {
    label: "Organizations",
    value: "—",
    hint: "Active workspaces on the platform",
    icon: Building2,
  },
  {
    label: "Weekly sign-ups",
    value: "—",
    hint: "New accounts in the last 7 days",
    icon: TrendingUp,
  },
  {
    label: "System health",
    value: "Operational",
    hint: "All core services responding",
    icon: Activity,
  },
];

export default function AdminDashboardPage() {
  const user = useAdminStore((state) => state.authData.user);
  const displayName = user?.full_name?.split(" ")[0] ?? "Admin";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </span>
          <p className="text-label text-primary">Platform administration</p>
        </div>
        <h1 className="text-h1 text-foreground">
          Welcome back, {displayName}
        </h1>
        <p className="max-w-2xl text-body text-muted-foreground">
          Manage users, organizations, and platform settings from this console.
          This area uses a separate sign-in from the member dashboard.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="vs-surface rounded-md border border-border p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                  {value}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        ))}
      </div>

      <section className="vs-surface rounded-md border border-border p-6">
        <h2 className="text-sm font-semibold text-foreground">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Additional admin modules (user directory, org moderation, audit logs)
          can be added under <code className="text-xs">/admin/*</code>.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="rounded-md border border-dashed border-border px-4 py-3">
            User management → <span className="text-foreground">/admin/users</span>
          </li>
          <li className="rounded-md border border-dashed border-border px-4 py-3">
            Organizations →{" "}
            <span className="text-foreground">/admin/organizations</span>
          </li>
          <li className="rounded-md border border-dashed border-border px-4 py-3">
            Platform settings →{" "}
            <span className="text-foreground">/admin/settings</span>
          </li>
          <li className="rounded-md border border-dashed border-border px-4 py-3">
            Member app →{" "}
            <a href="/dashboard" className="font-medium text-primary hover:underline">
              /dashboard
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
