import { Search, Bell, HelpCircle } from "lucide-react";
import Link from "next/link";

type TopNavProps = {
  breadcrumb: string;
};

export default function TopNav({ breadcrumb }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-10 backdrop-blur-md">
      <div className="flex items-center gap-6">
        {/* Breadcrumb */}
        <div className="text-sm font-bold text-blue-600">{breadcrumb}</div>

        {/* Search Bar */}
        <div className="relative w-80 max-w-[40vw]">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search career insights..."
            className="h-11 w-full rounded-full bg-[#f1f5f9] pl-11 pr-4 text-sm text-slate-600 outline-none transition-all focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Utility Icons */}
      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-blue-600"></span>
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <HelpCircle size={20} />
        </button>
        <Link href="/dashboard/profile">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander"
              alt="User"
              className="h-full w-full object-cover bg-slate-100"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
