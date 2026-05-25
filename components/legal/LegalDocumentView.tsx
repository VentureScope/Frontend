import Link from "next/link";
import type { LegalSection } from "@/lib/legal-documents";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-documents";

type LegalDocumentViewProps = {
  title: string;
  subtitle: string;
  sections: LegalSection[];
};

export function LegalDocumentView({
  title,
  subtitle,
  sections,
}: LegalDocumentViewProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 space-y-3 border-b border-border pb-8">
        <p className="text-label text-primary">Legal</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground">
          Last updated: {LEGAL_LAST_UPDATED}
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-lg font-semibold text-foreground">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul className="list-disc space-y-2 pl-5">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 flex flex-wrap gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
        <Link href="/" className="font-semibold text-primary hover:underline">
          ← Back to home
        </Link>
        <Link href="/terms" className="hover:text-primary hover:underline">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-primary hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </article>
  );
}
