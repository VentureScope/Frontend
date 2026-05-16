"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getInDemandSkills,
  getJobProfileMatches,
  getJobStats,
  getJobsByCategory,
  getTrendingCareers,
} from "@/lib/jobs-api";
import type {
  InDemandSkill,
  JobByCategoryRow,
  JobMatch,
  JobStats,
  TrendingCareer,
} from "@/types/jobs";
import { useAppStore } from "@/store/useAppStore";
import { SkillDemandPanel } from "@/components/landing/market/SkillDemandPanel";
import { MarketStatsPanel } from "@/components/landing/market/MarketStatsPanel";
import { TrendingRolesPanel } from "@/components/landing/market/TrendingRolesPanel";
import { CategoryJobsPanel } from "@/components/landing/market/CategoryJobsPanel";
import { ProfileMatchesPanel } from "@/components/landing/market/ProfileMatchesPanel";
import { MARKET_TOP_K } from "@/lib/job-market-insights";

export default function MarketInsightLive() {
  const token = useAppStore((s) => s.authData.token);
  const [skills, setSkills] = useState<InDemandSkill[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [trending, setTrending] = useState<TrendingCareer[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [categoryRows, setCategoryRows] = useState<JobByCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [sk, st, tr] = await Promise.all([
          getInDemandSkills({ limit: MARKET_TOP_K.skills }),
          getJobStats(),
          getTrendingCareers({ limit: MARKET_TOP_K.trending, period: 30 }),
        ]);
        if (cancelled) {
          return;
        }
        setSkills(sk);
        setStats(st);
        setTrending(tr);
        setUpdatedAt(new Date());

        const cat = tr[0]?.name;
        if (cat) {
          try {
            const rows = await getJobsByCategory({
              category: cat,
              limit: MARKET_TOP_K.categoryJobs,
            });
            if (!cancelled) {
              setCategoryRows(rows);
            }
          } catch {
            if (!cancelled) {
              setCategoryRows([]);
            }
          }
        }

        if (token) {
          try {
            const m = await getJobProfileMatches({
              limit: MARKET_TOP_K.profileMatches,
            });
            if (!cancelled) {
              setMatches(m);
            }
          } catch {
            if (!cancelled) {
              setMatches([]);
            }
          }
        } else if (!cancelled) {
          setMatches([]);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load market analytics.");
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
  }, [token]);

  return (
    <div className="bg-muted/50 pb-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-16 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:gap-8 md:flex-row md:items-end">
          <div className="space-y-3 sm:space-y-4 text-center md:text-left">
            <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              Live market intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Market Insights
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Understand what employers are hiring for right now—trending roles,
              in-demand skills, and where opportunities cluster across Ethiopia&apos;s
              tech economy.
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 rounded-2xl bg-card p-4 shadow-sm border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Last refreshed
              </p>
              <p className="font-bold text-foreground">
                {loading
                  ? "Updating…"
                  : updatedAt
                    ? updatedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 sm:mt-12 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkillDemandPanel skills={skills} loading={loading} />
          </div>
          <MarketStatsPanel stats={stats} loading={loading} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-6 sm:mt-8 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <TrendingRolesPanel careers={trending} loading={loading} />
          </div>
          <div className="lg:col-span-3">
            <CategoryJobsPanel
              jobs={categoryRows}
              categoryName={trending[0]?.name ?? null}
              loading={loading}
            />
            <ProfileMatchesPanel
              matches={matches}
              loading={loading}
              signedIn={Boolean(token)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 sm:mt-16 lg:px-8">
        <div className="rounded-3xl sm:rounded-[40px] bg-linear-to-b from-muted to-background border border-border p-8 sm:p-12 lg:p-24 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 space-y-6 sm:space-y-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">
              Turn insights into a career plan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Use VentureScope to generate learning roadmaps, tailored resumes,
              and profile-based job matches—all grounded in the same market data
              you see here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
              <Button
                asChild
                className="h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-10 rounded-xl bg-primary font-bold hover:bg-primary/90"
              >
                <Link href="/register">Get started free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-10 rounded-xl border-border bg-card font-bold text-muted-foreground hover:bg-muted"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
