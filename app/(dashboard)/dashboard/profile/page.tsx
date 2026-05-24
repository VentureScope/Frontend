import CareerInterests from "@/components/dashboard/profile/CareerInterests";
import ProfileCareerInsights from "@/components/dashboard/profile/ProfileCareerInsights";
import ProfileJobMatchesCard from "@/components/dashboard/profile/ProfileJobMatchesCard";
import ConnectedAccounts from "@/components/dashboard/profile/ConnectedAccounts";
import PersonalDetails from "@/components/dashboard/profile/PersonalDetails";
import ProfileHeader from "@/components/dashboard/profile/ProfileHeader";
import SkillIntelligence from "@/components/dashboard/profile/SkillIntelligence";
import CVManager from "@/components/dashboard/profile/CVManager";
import ExperienceSection from "@/components/dashboard/profile/ExperienceSection";

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-8 lg:space-y-8">
          <ProfileHeader />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <PersonalDetails />
            <ConnectedAccounts />
          </div>

          <ExperienceSection />

          <SkillIntelligence />

          <ProfileCareerInsights />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <CareerInterests />
          <CVManager />
          <ProfileJobMatchesCard />
        </div>
      </div>
    </div>
  );
}
