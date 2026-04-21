import AICallout from "@/components/dashboard/profile/AICallout";
import CareerInterests from "@/components/dashboard/profile/CareerInterests";
import ConnectedAccounts from "@/components/dashboard/profile/ConnectedAccounts";
import PersonalDetails from "@/components/dashboard/profile/PersonalDetails";
import ProfileHeader from "@/components/dashboard/profile/ProfileHeader";
import SkillIntelligence from "@/components/dashboard/profile/SkillIntelligence";
import CVManager from "@/components/dashboard/profile/CVManager";

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
      <div className="mb-8 grid grid-cols-1 gap-6 md:mb-12 md:gap-8 xl:mb-16 xl:grid-cols-12 xl:gap-10">
        {/* LEFT COLUMN: Profile & Skills */}
        <div className="space-y-8 xl:col-span-8 xl:space-y-10">
          <ProfileHeader />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <PersonalDetails />
            <ConnectedAccounts />
          </div>

          <SkillIntelligence />
        </div>

        {/* RIGHT COLUMN: Interests & CV */}
        <div className="space-y-6 xl:col-span-4 xl:space-y-8">
          <CareerInterests />
          <CVManager />
        </div>
      </div>

      <AICallout />
    </div>
  );
}
