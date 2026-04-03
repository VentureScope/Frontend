import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#020817] p-12 lg:p-24 relative">
        {/* Background glow */}
        <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-10">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-tight">
            Ready to upgrade your professional intelligence?
          </h2>
          <p className="text-lg text-slate-400">
            Join thousands of Ethiopian tech professionals who are using
            VentureScope to navigate their career paths.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-xl bg-blue-600 px-10 font-bold hover:bg-blue-700"
            >
              <Link href="/register">Create Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-xl border-slate-800 bg-white/5 px-10 font-bold text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
