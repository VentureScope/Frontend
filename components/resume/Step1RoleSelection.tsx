"use client";

import { useEffect, useState } from "react";
import { Search, TrendingUp, X, Loader2 } from "lucide-react";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";
import type { Role } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { getTrendingCareers } from "@/lib/jobs-api";
import type { TrendingCareer } from "@/types/jobs";
import { toast } from "sonner";

function careerToRole(c: TrendingCareer, i: number): Role {
  const g = c.growth_pct ?? 0;
  let demand: Role["demand"] = "STABLE";
  if (g >= 12 || c.job_count > 6000) {
    demand = "HIGH DEMAND";
  } else if (g < 2 && g >= 0) {
    demand = "EMERGING";
  }
  const demandColor =
    demand === "HIGH DEMAND"
      ? "vs-badge vs-badge-warning"
      : demand === "EMERGING"
        ? "vs-badge vs-badge-accent"
        : "vs-badge vs-badge-success";
  const icons = ["☁️", "</> ", "📊", "🧠", "🎨", "🛡️"];
  return {
    id: `live-${i}-${c.name.slice(0, 24)}`,
    title: c.name,
    description: `${c.job_count.toLocaleString()} postings · ${c.company_count.toLocaleString()} employers`,
    icon: icons[i % icons.length],
    demand,
    demandColor,
    trend: Math.max(0.1, Math.abs(g)),
    trendDirection: g >= 0 ? "up" : "stable",
  };
}

export default function Step1RoleSelection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedRole, setStep, closeFlow } = useResumeBuilderStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const careers = await getTrendingCareers({ limit: 24, period: 30 });
        if (!cancelled) {
          setRoles(careers.map(careerToRole));
        }
      } catch {
        if (!cancelled) {
          toast.error("Could not load trending roles.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRoles = roles.filter(
    (role) =>
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role.title);
    setStep("step2");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full bg-card rounded-xl shadow-sm border border-border">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-8 sm:px-8 flex items-start gap-4 rounded-t-3xl">
          <button
            type="button"
            onClick={() => closeFlow()}
            className="flex-shrink-0 mt-1 p-2 hover:bg-muted rounded-lg transition-colors border border-border"
          >
            <span className="sr-only">Go back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-label mb-2 text-primary">Step 1 of 4</p>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Select Target Role
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Pick a role that matches where you want to go next. Suggestions reflect
              current market demand.
            </p>
          </div>
          <button
            type="button"
            onClick={() => closeFlow()}
            className="flex-shrink-0 mt-1 p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 py-6 sm:px-8 border-b border-border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for any professional role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted py-3 pr-4 pl-12 text-sm focus:border-primary focus:ring-1 focus:ring-ring/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="inline-block">Trending Roles</span>
            <span className="text-label text-secondary">Live market data</span>
          </h3>

          {loading ? (
            <div className="flex justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading roles…
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className="rounded-lg border border-border bg-muted/50 p-6 text-left transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{role.icon}</div>
                    <span className={role.demandColor}>
                      {role.demand}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    {role.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <div className="flex items-center gap-2 text-xs font-medium text-success">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{role.trend}% signal</span>
                  </div>
                </button>
              ))}
              {filteredRoles.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-8">
                  No roles match your search.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
