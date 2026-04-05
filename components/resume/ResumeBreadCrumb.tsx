import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ResumeBreadcrumb() {
  return (
    <nav className="mb-10 flex items-center gap-3 text-sm font-medium">
      <Link
        href="/dashboard/resume-builder"
        className="text-slate-900 hover:text-blue-600 transition-colors"
      >
        Resume Builder
      </Link>
      <span className="text-slate-300">/</span>
      <span className="text-slate-400">Senior Product Designer</span>
    </nav>
  );
}
