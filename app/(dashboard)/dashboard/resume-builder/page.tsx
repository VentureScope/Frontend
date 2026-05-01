"use client";

import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";
import ResumeListingPage from "@/components/resume/ResumeListingPage";
import Step1RoleSelection from "@/components/resume/Step1RoleSelection";
import Step2HighlightsSelection from "@/components/resume/Step2HighlightsSelection";
import Step3Editor from "@/components/resume/Step3Editor";

export default function ResumeBuilderPage() {
  const { step } = useResumeBuilderStore();

  // Show flow modals based on current step
  if (step !== "closed") {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        {step === "step1" && <Step1RoleSelection />}
        {step === "step2" && <Step2HighlightsSelection />}
        {step === "step3" && <Step3Editor />}
      </div>
    );
  }

  // Show resume listing page by default
  return <ResumeListingPage />;
}
