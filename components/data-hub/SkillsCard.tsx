"use client";

import Link from "next/link";
import { Briefcase, Sparkles } from "lucide-react";
import { DataHubSkillsCardSkeleton } from "@/components/data-hub/DataHubSkeletons";
import type { AuthUser, Experience } from "@/types/auth";
import { isSkillsSynced } from "@/lib/data-hub-utils";

type SkillsCardProps = {
  profile: AuthUser | null;
  experiences: Experience[];
  loading?: boolean;
};

export default function SkillsCard({
  profile,
  experiences,
  loading,
}: SkillsCardProps) {
  const skills = profile?.skills ?? [];
  const connected = isSkillsSynced(profile, experiences);

  if (loading) {
    return <DataHubSkillsCardSkeleton />;
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="vs-icon-tile vs-icon-tile-primary h-12 w-12">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Skills & experience
              </h3>
              <p className="text-sm text-muted-foreground">
                From your profile and work history APIs
              </p>
            </div>
          </div>
          <span
            className={
              connected
                ? "vs-badge vs-badge-success"
                : "vs-badge bg-muted text-muted-foreground"
            }
          >
            {connected ? "On file" : "Empty"}
          </span>
        </div>

        {connected ? (
          <>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 12).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 12 ? (
                <span className="text-xs text-muted-foreground">
                  +{skills.length - 12} more
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {experiences.length} work experience
              {experiences.length === 1 ? "" : "s"} on profile
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add skills and roles in your profile so roadmaps, resumes, and job
            matches reflect your background.
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <Link
          href="/dashboard/profile"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Edit profile →
        </Link>
      </div>
    </div>
  );
}
