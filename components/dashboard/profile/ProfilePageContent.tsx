"use client";

import CareerInterests from "@/components/dashboard/profile/CareerInterests";
import ProfileCareerInsights from "@/components/dashboard/profile/ProfileCareerInsights";
import ProfileJobMatchesCard from "@/components/dashboard/profile/ProfileJobMatchesCard";
import ConnectedAccounts from "@/components/dashboard/profile/ConnectedAccounts";
import PersonalDetails from "@/components/dashboard/profile/PersonalDetails";
import ProfileHeader from "@/components/dashboard/profile/ProfileHeader";
import SkillIntelligence from "@/components/dashboard/profile/SkillIntelligence";
import CVManager from "@/components/dashboard/profile/CVManager";
import ExperienceSection from "@/components/dashboard/profile/ExperienceSection";
import CertificatesSection from "@/components/dashboard/profile/CertificatesSection";
import { useProfilePage } from "@/hooks/useProfilePage";

export default function ProfilePageContent() {
  const page = useProfilePage();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-8 lg:space-y-8">
          <ProfileHeader
            user={page.profile}
            loading={page.loading.header}
            onProfileUpdated={page.setProfile}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <PersonalDetails
              user={page.profile}
              loading={page.loading.personal}
            />
            <ConnectedAccounts
              profile={page.profile}
              github={page.github}
              transcript={page.transcript}
              loading={page.loading.connected}
            />
          </div>

          <ExperienceSection />
          <CertificatesSection />
          <SkillIntelligence
            profile={page.profile}
            github={page.github}
            loading={page.loading.skills}
          />
          <ProfileCareerInsights
            readiness={page.readiness}
            loading={page.loading.readiness}
            refreshing={page.refreshingReadiness}
            error={page.readinessError}
            onRefresh={() => void page.refreshReadiness()}
          />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <CareerInterests
            user={page.profile}
            loading={page.loading.interests}
            onProfileUpdated={page.setProfile}
          />
          <CVManager profile={page.profile} loading={page.loading.cv} />
          <ProfileJobMatchesCard />
        </div>
      </div>
    </div>
  );
}
