"use client";

import { useEffect } from "react";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";
import Step1RoleSelection from "@/components/resume/Step1RoleSelection";
import Step2HighlightsSelection from "@/components/resume/Step2HighlightsSelection";
import Step3Editor from "@/components/resume/Step3Editor";
import ResumeBreadcrumb from "@/components/resume/ResumeBreadCrumb";
import ProfileIntelligence from "@/components/resume/ProfileIntelligence";
import ProfessionalSummary from "@/components/resume/ProfessionalSummary";
import SkillMatrix from "@/components/resume/SkillMatrix";
import ExperienceHistory from "@/components/resume/ExperienceHistory";
import AtsAnalytics from "@/components/resume/AtsAnalytics";
import ResumePreview from "@/components/resume/ResumePreview";

export default function ResumeBuilderPage() {
  const { step, openFlow } = useResumeBuilderStore();

  // Open the flow when the page loads
  useEffect(() => {
    if (step === "closed") {
      openFlow();
    }
  }, []);

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

  // Show original editor after flow is complete
  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 xl:px-12">
      <div className="mx-auto max-w-7xl">
        <ResumeBreadcrumb />

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Controls & Data */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-7">
            <ProfileIntelligence />
            <div className="space-y-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:space-y-10 sm:p-7 lg:rounded-[32px] lg:p-10">
              <ProfessionalSummary />
              <SkillMatrix />
              <ExperienceHistory />
            </div>
          </div>

          {/* RIGHT COLUMN: Analysis & Preview */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-5">
            <AtsAnalytics />
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
