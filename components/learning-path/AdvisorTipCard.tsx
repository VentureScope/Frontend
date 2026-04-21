// components/learning-path/AdvisorTipCard.tsx
import { Lightbulb } from "lucide-react";

export default function AdvisorTipCard() {
  return (
    <div className="relative h-72 sm:h-80 overflow-hidden rounded-3xl sm:rounded-[40px] bg-slate-900 shadow-2xl">
      {/* Background Image - Modern Architecture / Windows */}
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
        alt="Office Architecture"
      />

      {/* Gradient Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 pb-8 sm:p-10 sm:pb-12">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 backdrop-blur-md border border-blue-400/20 shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>

        <h3 className="mb-2 text-lg sm:text-xl font-black text-white tracking-tight">
          Pro Advisor Tip
        </h3>
        <p className="text-sm sm:text-[15px] font-medium italic leading-relaxed text-slate-300">
          "For Senior roles, recruiters prioritize 'System Thinking' over raw
          coding speed. Focus on how your models impact the bottom line."
        </p>
      </div>
    </div>
  );
}
