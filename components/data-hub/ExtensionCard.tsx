// components/data-hub/ExtensionCard.tsx
import { Chrome, ShieldCheck, Zap, Download } from "lucide-react";

export default function ExtensionCard() {
  return (
    <div className="flex h-full flex-col justify-between rounded-[32px] bg-blue-600 p-10 text-white shadow-xl shadow-blue-500/20">
      <div className="space-y-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
          <Chrome size={24} />
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold">Browser Extension</h3>
          <p className="text-sm leading-relaxed text-blue-100">
            Automate your academic data extraction. Seamlessly pull grades and
            transcripts from university portals with one click.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 border border-white/10">
            <ShieldCheck size={18} className="text-blue-200" />
            <span className="text-xs font-semibold">
              Secure data extraction
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 border border-white/10">
            <Zap size={18} className="text-blue-200" />
            <span className="text-xs font-semibold">
              One-click transcript parsing
            </span>
          </div>
        </div>
      </div>

      <button className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-bold text-blue-600 transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <Download size={18} /> Install Chrome Extension
      </button>
    </div>
  );
}
