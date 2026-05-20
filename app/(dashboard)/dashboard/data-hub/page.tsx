"use client";

import GitHubCard from "@/components/data-hub/GitHubCard";
import ExtensionCard from "@/components/data-hub/ExtensionCard";
import AcademicStatusCard from "@/components/data-hub/AcademicStatusCard";
import OnboardingSteps from "@/components/data-hub/OnboardingSteps";
import DataHubSummary from "@/components/data-hub/DataHubSummary";
import CvCard from "@/components/data-hub/CvCard";
import SkillsCard from "@/components/data-hub/SkillsCard";
import { useDataHub } from "@/hooks/useDataHub";
import { getGithubSyncedData } from "@/lib/auth-api";

export default function DataHubPage() {
  const hub = useDataHub();

  const refreshGithub = async () => {
    try {
      const data = await getGithubSyncedData();
      hub.setGithub(data);
    } catch {
      hub.setGithub(null);
    }
  };

  const refreshTranscript = async () => {
    await hub.reload();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
      <header className="mb-8 space-y-2 sm:mb-10 sm:space-y-3">
        <span className="text-label text-primary">Intelligence Source</span>
        <h1 className="text-h1 text-foreground">Data Onboarding Hub</h1>
        <p className="text-body max-w-2xl text-muted-foreground">
          Centralize your professional identity. Sync GitHub, academic
          transcripts, CV, and profile skills — all sources used by resume and
          roadmap generation.
        </p>
      </header>

      <DataHubSummary
        sources={hub.sources}
        completionPercent={hub.completionPercent}
        loading={hub.loading}
      />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:mb-8 sm:gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <GitHubCard
            data={hub.github}
            loading={hub.loading}
            onRefresh={refreshGithub}
          />
        </div>
        <div className="lg:col-span-5">
          <ExtensionCard
            transcript={hub.transcript}
            versionCount={hub.transcriptList?.total_count ?? 0}
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:mb-8 lg:grid-cols-2">
        <CvCard
          profile={hub.profile}
          loading={hub.loading}
          onUpload={hub.uploadCv}
          onChanged={hub.refreshProfile}
        />
        <SkillsCard
          profile={hub.profile}
          experiences={hub.experiences}
          loading={hub.loading}
        />
      </div>

      <div className="mb-8 sm:mb-12">
        <AcademicStatusCard
          transcript={hub.transcript}
          transcriptList={hub.transcriptList}
          config={hub.config}
          loading={hub.loading}
          onRefresh={refreshTranscript}
        />
      </div>

      <OnboardingSteps sources={hub.sources} />
    </div>
  );
}
