import Link from "next/link";

export default function ResumeBreadcrumb() {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium sm:mb-8 sm:gap-3 sm:text-sm">
      <Link
        href="/dashboard/resume-builder"
        className="text-foreground hover:text-primary transition-colors"
      >
        Resume Builder
      </Link>
      <span className="text-muted-foreground/50">/</span>
      <span className="max-w-full wrap-break-word text-muted-foreground">
        Senior Product Designer
      </span>
    </nav>
  );
}
