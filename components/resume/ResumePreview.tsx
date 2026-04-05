import React from "react";
import { Settings2, Download } from "lucide-react";

export default function ResumePreview() {
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
    <div className="w-full max-w-[650px] overflow-hidden rounded-[40px] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-50">
      {/* 1. Main Resume Paper Content */}
      <div className="p-14 pb-8 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h2 className="text-[38px] font-black tracking-tight text-[#0f172a] uppercase leading-none">
            Alexander Chase
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>alex.chase@portfolio.com</span>
            <div className="h-1 w-1 bg-slate-300 rounded-full" />
            <span>linkedin.com/in/achase</span>
            <div className="h-1 w-1 bg-slate-300 rounded-full" />
            <div className="text-center">
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Section: Professional Profile */}
        <div className="space-y-5">
          <h4 className="text-[11px] font-bold text-[#1d59db] uppercase tracking-[0.2em] border-b border-slate-100 pb-2.5">
            Professional Profile
          </h4>
          <p className="text-[14.5px] leading-relaxed text-slate-600 font-medium">
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
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {technicalStack.map((skill) => (
              <div
                key={skill.name}
                className="flex justify-between items-center text-[13px] font-bold"
              >
                <span className="text-slate-800">{skill.name}</span>
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
                <div className="flex justify-between items-baseline">
                  <h5 className="text-[15.5px] font-bold text-[#0f172a]">
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
      <div className="flex gap-4 p-14 pt-6 border-t border-slate-50/50">
        <button className="flex-1 flex items-center justify-center gap-3 h-14 rounded-full bg-[#eff6ff] text-[#1d59db] text-sm font-bold hover:bg-[#e1eeff] transition-colors shadow-sm">
          <Settings2 size={18} strokeWidth={2.5} />
          Change Template
        </button>
        <button className="flex-[1.4] flex items-center justify-center gap-3 h-14 rounded-full bg-[#0f172a] text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-[#0f172a]/10">
          <Download size={18} strokeWidth={2.5} />
          Export PDF
        </button>
      </div>
    </div>
  );
}
