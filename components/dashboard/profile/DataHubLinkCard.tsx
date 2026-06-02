import Link from "next/link";
import { Database, ArrowUpRight } from "lucide-react";

export default function DataHubLinkCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Database size={18} />
        <span className="text-label">Intelligence sources</span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        GitHub, CV, transcripts, and synced skills are managed in the Data Hub —
        not on this page.
      </p>
      <Link
        href="/dashboard/data-hub"
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        Open Data Hub
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}
