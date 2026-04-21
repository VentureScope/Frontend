// components/data-hub/ExtensionCard.tsx
import { Chrome, ShieldCheck, Zap, Download } from "lucide-react";

export default function ExtensionCard() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl sm:rounded-[32px] bg-blue-600 p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-blue-500/20">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
          <Chrome className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold">Browser Extension</h3>
          <p className="text-xs sm:text-sm leading-relaxed text-blue-100">
            Automate your academic data extraction. Seamlessly pull grades and
            transcripts from university portals with one click.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3 rounded-xl bg-white/10 p-3 sm:p-4 border border-white/10">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200 shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold">
              Secure data extraction
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 rounded-xl bg-white/10 p-3 sm:p-4 border border-white/10">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200 shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold">
              One-click transcript parsing
            </span>
          </div>
        </div>
      </div>

      <button className="mt-8 sm:mt-10 flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-white py-3 sm:py-4 text-xs sm:text-base font-bold text-blue-600 transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <Download className="h-4 w-4 sm:h-5 sm:w-5" /> Install Extension
      </button>
    </div>
  );
}
