import { Pencil, MapPin } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
      <div className="relative">
        <div className="h-32 w-32 overflow-hidden rounded-[24px] border-4 border-white shadow-xl bg-slate-200">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander"
            alt="Alexander Sterling"
            className="h-full w-full object-cover"
          />
        </div>
        <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-2 border-white hover:bg-blue-700">
          <Pencil size={14} />
        </button>
      </div>

      <div className="space-y-1 text-center md:text-left pt-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Alexander Sterling
        </h1>
        <p className="flex items-center justify-center gap-2 text-lg text-slate-500 md:justify-start">
          Senior Strategic Consultant • London, UK
        </p>
      </div>
    </div>
  );
}
