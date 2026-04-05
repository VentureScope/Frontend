import React from "react";

export default function MarketFitCard() {
  return (
    <div className="w-95 rounded-[42px] bg-[#1a2436] p-10 text-white shadow-2xl shadow-black/40">
      {/* Header Label */}
      <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400/80">
        Market Fit Score
      </p>

      {/* Main Score Display */}
      <div className="mb-8 flex items-baseline gap-1.5">
        <span className="text-[78px] font-black leading-none tracking-tighter">
          84
        </span>
        <span className="text-2xl font-semibold text-slate-500/80">/100</span>
      </div>

      {/* Description Text */}
      <p className="mb-10 text-[15.5px] leading-relaxed text-slate-400">
        Your skills are highly competitive for{" "}
        <span className="font-bold text-[#a5b4fc] decoration-[#a5b4fc]/30 underline-offset-4 hover:underline cursor-pointer">
          Senior Data Scientist
        </span>{" "}
        roles in Fintech and Logistics.
      </p>

      {/* Progress Bars Section */}
      <div className="space-y-9 border-b border-slate-700/40 pb-10 mb-8">
        {/* Technical Match */}
        <div className="space-y-3.5">
          <div className="flex justify-between text-[13px] font-bold">
            <span className="text-slate-500 font-medium">Technical Match</span>
            <span className="text-white">92%</span>
          </div>
          <div className="h-1.25 w-full rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-[#a5b4fc] rounded-full shadow-[0_0_12px_rgba(165,180,252,0.3)]"
              style={{ width: "92%" }}
            />
          </div>
        </div>

        {/* Leadership Index */}
        <div className="space-y-3.5">
          <div className="flex justify-between text-[13px] font-bold">
            <span className="text-slate-500 font-medium">Leadership Index</span>
            <span className="text-white">68%</span>
          </div>
          <div className="h-1.25 w-full rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-[#fca5a5] rounded-full shadow-[0_0_12px_rgba(252,165,165,0.3)]"
              style={{ width: "68%" }}
            />
          </div>
        </div>
      </div>

      {/* Footer Section: Gaps Detected */}
      <div className="space-y-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500/80">
          Gaps Detected
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-[#3b1c24] border border-[#7f1d1d]/20 px-5 py-2 text-[12px] font-bold text-[#fca5a5] hover:bg-[#4d252e] transition-colors cursor-default">
            MLOps
          </span>
          <span className="rounded-full bg-[#3b1c24] border border-[#7f1d1d]/20 px-5 py-2 text-[12px] font-bold text-[#fca5a5] hover:bg-[#4d252e] transition-colors cursor-default">
            System Design
          </span>
        </div>
      </div>
    </div>
  );
}
