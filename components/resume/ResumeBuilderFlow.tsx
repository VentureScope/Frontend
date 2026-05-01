"use client";

import dynamic from "next/dynamic";
import { useResumeBuilderStore } from "@/store/useResumeBuilderStore";

const Step1RoleSelection = dynamic(() => import("./Step1RoleSelection"), {
  ssr: false,
});
const Step2HighlightsSelection = dynamic(
  () => import("./Step2HighlightsSelection"),
  { ssr: false }
);
const Step3Editor = dynamic(() => import("./Step3Editor"), { ssr: false });

export default function ResumeBuilderFlow() {
  const step = useResumeBuilderStore((state) => state.step);

  if (step === "closed") return null;

  return (
    <>
      {step === "step1" && <Step1RoleSelection />}
      {step === "step2" && <Step2HighlightsSelection />}
      {step === "step3" && <Step3Editor />}
    </>
  );
}
