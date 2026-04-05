import ProfileFooter from "@/components/dashboard/layout/ProfileFooter";
import AICallout from "@/components/dashboard/profile/AICallout";
import CareerInterests from "@/components/dashboard/profile/CareerInterests";
import ConnectedAccounts from "@/components/dashboard/profile/ConnectedAccounts";
import PersonalDetails from "@/components/dashboard/profile/PersonalDetails";
import ProfileHeader from "@/components/dashboard/profile/ProfileHeader";
import SkillIntelligence from "@/components/dashboard/profile/SkillIntelligence";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-350 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 gap-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 mb-10 md:mb-20">
        {/* LEFT COLUMN: Profile & Skills */}
        <div className="space-y-10 lg:col-span-8">
          <ProfileHeader />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PersonalDetails />
            <ConnectedAccounts />
          </div>

          <SkillIntelligence />
        </div>

        {/* RIGHT COLUMN: Interests & Insights */}
        <div className="space-y-8 lg:col-span-4">
          <CareerInterests />
        </div>
      </div>

      <AICallout />
    </div>
  );
}
