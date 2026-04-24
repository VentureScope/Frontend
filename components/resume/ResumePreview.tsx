"use client";

import React from "react";
import { Settings2, Download } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function ResumePreview() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  const technicalStack = [
    { name: "User Experience", level: "Expert" },
    { name: "React / Tailwind", level: "Advanced" },
    { name: "Figma Architect", level: "Expert" },
    { name: "System Design", level: "Advanced" },
  ];

  const experience = [
    {
      company: "FinSphere",
      role: "Lead Product Designer",
      period: "2021 — Present",
      bullets: [
        'Architected the "Aura" Design System used by 12+ internal teams.',
        "Increased core transaction conversion rate by 22% via new UI patterns.",
      ],
    },
    {
      company: "Creative Logic",
      role: "Senior Designer",
      period: "2018 — 2021",
      bullets: [
        "Led redesign of the SaaS analytics dashboard.",
        "Mentored 4 junior designers in atomic design principles.",
      ],
    },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-50 bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] lg:rounded-[40px]">
      {/* 1. Main Resume Paper Content */}
      <div className="space-y-8 p-5 pb-6 sm:space-y-10 sm:p-8 sm:pb-7 lg:space-y-12 lg:p-12 lg:pb-8 xl:p-14">
        {/* Header Section */}
        <div className="space-y-4 text-center sm:space-y-6">
          <h2 className="wrap-break-word text-2xl font-black uppercase leading-tight tracking-tight text-[#0f172a] sm:text-3xl lg:text-[38px] lg:leading-none">
            {profile.fullName}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:gap-x-4 sm:text-[11px]">
            <span className="wrap-break-word text-center">{profile.email}</span>
            <div className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span className="wrap-break-word text-center">
              {profile.githubUsername
                ? `github.com/${profile.githubUsername}`
                : "Professional Profile"}
            </span>
            <div className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <div className="text-center">
              <span className="wrap-break-word">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Section: Professional Profile */}
        <div className="space-y-5">
          <h4 className="text-[11px] font-bold text-[#1d59db] uppercase tracking-[0.2em] border-b border-slate-100 pb-2.5">
            Professional Profile
          </h4>
          <p className="text-[13.5px] font-medium leading-relaxed text-slate-600 sm:text-[14.5px]">
            Senior Product Designer with 6+ years of experience in fin-tech and
            digital curator aesthetics. Proven track record of increasing user
            engagement by 40% through intentional design systems and
            accessibility-first frameworks.
          </p>
        </div>

        {/* Section: Technical Stack */}
        <div className="space-y-5">
          <h4 className="text-[11px] font-bold text-[#1d59db] uppercase tracking-[0.2em] border-b border-slate-100 pb-2.5">
            Technical Stack
          </h4>
          <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
            {technicalStack.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between gap-3 text-[13px] font-bold"
              >
                <span className="wrap-break-word text-slate-800">
                  {skill.name}
                </span>
                <span className="text-slate-400 font-medium">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Experience */}
        <div className="space-y-8">
          <h4 className="text-[11px] font-bold text-[#1d59db] uppercase tracking-[0.2em] border-b border-slate-100 pb-2.5">
            Experience
          </h4>
          <div className="space-y-10">
            {experience.map((job, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h5 className="wrap-break-word text-[15px] font-bold text-[#0f172a] sm:text-[15.5px]">
                    {job.company} — {job.role}
                  </h5>
                  <span className="text-[11px] font-bold text-slate-400">
                    {job.period}
                  </span>
                </div>
                <ul className="space-y-2 pl-4">
                  {job.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-[13.5px] text-slate-500 leading-relaxed list-disc"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Action Buttons Footer */}
      <div className="flex flex-col gap-3 border-t border-slate-50/50 p-5 pt-5 sm:flex-row sm:gap-4 sm:p-8 sm:pt-6 lg:p-12 xl:p-14">
        <button className="flex h-12 flex-1 items-center justify-center gap-3 rounded-full bg-[#eff6ff] text-xs font-bold text-[#1d59db] shadow-sm transition-colors hover:bg-[#e1eeff] sm:h-14 sm:text-sm">
          <Settings2 size={18} strokeWidth={2.5} />
          Change Template
        </button>
        <button className="flex h-12 flex-[1.4] items-center justify-center gap-3 rounded-full bg-[#0f172a] text-xs font-bold text-white shadow-xl shadow-[#0f172a]/10 transition-all hover:bg-slate-800 sm:h-14 sm:text-sm">
          <Download size={18} strokeWidth={2.5} />
          Export PDF
        </button>
      </div>
    </div>
  );
}
