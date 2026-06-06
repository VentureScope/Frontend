import Link from "next/link";
import { VentureScopeLogo } from "@/components/brand/VentureScopeLogo";

export default function ProfileFooter() {
  return (
    <footer className="mt-20 border-t border-border py-10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <VentureScopeLogo size={20} />
            <h3 className="text-sm font-semibold text-foreground">VentureScope</h3>
          </div>
          <p className="text-body text-muted-foreground">
            © 2026 VentureScope Intelligence. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <Link
            href="/privacy"
            className="text-label text-muted-foreground transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-label text-muted-foreground transition-colors hover:text-primary"
          >
            Terms of Service
          </Link>
          <a
            href="mailto:support@venturescope.com"
            className="text-label text-muted-foreground transition-colors hover:text-primary"
          >
            Contact Support
          </a>
        </nav>

        <div className="text-label flex items-center gap-2 text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
          System operational
        </div>
      </div>
    </footer>
  );
}
