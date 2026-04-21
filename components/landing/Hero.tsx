import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-blue-50/50 via-white to-white pb-20 pt-20 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 border border-blue-200/50">
              <Sparkles className="h-3 w-3" />
              The Intelligence Layer
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Navigating Tech Careers in{" "}
              <span className="text-blue-600 underline decoration-blue-100 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">
                Ethiopia.
              </span>
            </h1>

            <p className="max-w-lg text-base sm:text-lg leading-relaxed text-slate-500">
              Data-driven career guidance for the next generation of Ethiopian
              tech leaders. Bridge the gap between education and global
              employability.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 w-full sm:w-auto rounded-full bg-[#1d59db] px-8 font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                <Link href="/register" className="flex justify-center w-full">
                  Join the Beta <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 w-full sm:w-auto rounded-full bg-blue-50 px-8 font-bold text-blue-700 hover:bg-blue-100"
              >
                Explore Trends
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-135 lg:mr-0">
            <div className="absolute -inset-4 rounded-[40px] bg-linear-to-tr from-blue-600/20 to-transparent blur-2xl" />
            <div className="relative aspect-square overflow-hidden rounded-[32px] border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"
                alt="Professional in Tech"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
