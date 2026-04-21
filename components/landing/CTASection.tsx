import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl sm:rounded-[40px] bg-[#020817] p-8 sm:p-12 lg:p-24 relative">
        {/* Background glow */}
        <div className="absolute -left-1/10 -top-1/5 h-75 w-75 sm:h-125 sm:w-125 rounded-full bg-blue-600/20 blur-[80px] sm:blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-6 sm:space-y-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Ready to upgrade your professional intelligence?
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Join thousands of Ethiopian tech professionals who are using
            VentureScope to navigate their career paths.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="h-12 w-full sm:w-auto sm:h-14 rounded-xl bg-blue-600 px-8 sm:px-10 font-bold hover:bg-blue-700"
            >
              <Link href="/register">Create Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full sm:w-auto sm:h-14 rounded-xl border-slate-800 bg-white/5 px-8 sm:px-10 font-bold text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
