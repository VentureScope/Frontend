// components/dashboard/profile/CareerInterests.tsx
"use client";

import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function CareerInterests() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);
  const tags = [
    profile.careerInterest,
    "AI Governance",
    "Career Intelligence",
    "Growth Opportunities",
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Career Interests</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Your curated interests help our AI engine surface the most relevant
          market shifts and role opportunities for {profile.firstName}.
        </p>
        <div className="flex flex-wrap gap-3">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-sm"
            >
              {t}
            </span>
          ))}
          <button className="flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-slate-50/50 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors">
            + Explore More
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#eff6ff] p-6 border border-blue-100 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
          Curation Tip
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Adding "AI Governance" has increased your match score for Director
          roles by 14%.
        </p>
      </div>
    </div>
  );
}
