"use client";

import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopNav from "@/components/dashboard/layout/TopNav";
import GitHubCard from "@/components/data-hub/GitHubCard";
import ExtensionCard from "@/components/data-hub/ExtensionCard";
import AcademicStatusCard from "@/components/data-hub/AcademicStatusCard";
import OnboardingSteps from "@/components/data-hub/OnboardingSteps";

export default function DataHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      {/* Header Section */}
      <header className="mb-12 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
          Intelligence Source
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Data Onboarding Hub
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-500">
          Centralize your professional identity. Sync your technical projects
          and academic achievements to unlock precision career matching.
        </p>
      </header>

      {/* Top Grid: GitHub & Extension */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 mb-8">
        <div className="lg:col-span-7">
          <GitHubCard />
        </div>
        <div className="lg:col-span-5">
          <ExtensionCard />
        </div>
      </div>

      {/* Middle: Academic Status */}
      <div className="mb-12">
        <AcademicStatusCard />
      </div>

      {/* Bottom: How it works */}
      <OnboardingSteps />
    </div>
  );
}
