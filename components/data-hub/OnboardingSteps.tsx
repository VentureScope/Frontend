import React from "react";

const steps = [
  {
    number: "01",
    title: "Connect Portal",
    description:
      "Log in once to your university or GitHub account using our secure OAuth2 flow.",
  },
  {
    number: "02",
    title: "Data Scrubbing",
    description:
      "VentureScope filters and anonymizes your personal information while keeping skill data.",
  },
  {
    number: "03",
    title: "Profile Scoring",
    description:
      "Extracted metrics are immediately applied to your VentureMatch score and ranking.",
  },
];

export default function OnboardingSteps() {
  return (
    <section className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.number}
          className="group relative flex flex-col gap-6 rounded-[32px] bg-white p-10 shadow-sm border border-slate-50 transition-all hover:shadow-md hover:border-blue-100"
        >
          {/* Large Step Number */}
          <span className="text-5xl font-black tracking-tighter text-blue-600/10 group-hover:text-blue-600/20 transition-colors">
            {step.number}
          </span>

          <div className="space-y-3">
            <h4 className="text-xl font-bold text-slate-900">{step.title}</h4>
            <p className="text-sm leading-relaxed text-slate-500">
              {step.description}
            </p>
          </div>

          {/* Subtle Accent Line */}
          <div className="absolute bottom-0 left-10 right-10 h-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </section>
  );
}
