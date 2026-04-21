import Link from "next/link";
import Image from "next/image";

export default function ProfileFooter() {
  return (
    <footer className="mt-20 border-t border-slate-100 py-10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Brand & Copyright */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Image
              src="/logo.png"
              alt="VentureScope Logo"
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
            <h3 className="text-sm font-bold text-slate-900">VentureScope</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            © 2026 VentureScope Intelligence. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 text-[11px] font-medium text-slate-500">
          <Link href="#" className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">
            Contact Support
          </Link>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-600">
          SYSTEM STATUS: OPERATIONAL
        </div>
      </div>
    </footer>
  );
}
