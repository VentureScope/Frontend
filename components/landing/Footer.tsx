import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="VentureScope Logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="text-xl font-bold text-foreground">
                VentureScope
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 VentureScope Intelligence. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:justify-end md:gap-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary">
              Contact Support
            </Link>
            <Link href="#" className="hover:text-primary">
              API Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
