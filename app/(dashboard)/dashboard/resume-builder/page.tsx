"use client";

import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";
import ResumeListingPage from "@/components/resume/ResumeListingPage";
import Step1RoleSelection from "@/components/resume/Step1RoleSelection";
import Step2HighlightsSelection from "@/components/resume/Step2HighlightsSelection";
import Step3Editor from "@/components/resume/Step3Editor";

export default function ResumeBuilderPage() {
  const { step } = useResumeBuilderStore();

  if (step === "closed") {
    // Show resume listing page by default
    return <ResumeListingPage />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      {step === "step1" && <Step1RoleSelection />}
      {step === "step2" && <Step2HighlightsSelection />}
      {step === "step3" && <Step3Editor />}
    </div>
  );
}
