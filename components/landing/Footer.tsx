import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 fill-blue-600" />
              <span className="text-xl font-bold text-slate-900">
                VentureScope
              </span>
            </div>
            <p className="text-xs text-slate-500">
              © 2026 VentureScope Intelligence. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:justify-end md:gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="#" className="hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Contact Support
            </Link>
            <Link href="#" className="hover:text-blue-600">
              API Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
