import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MarketingPhoto } from "@/components/landing/MarketingPhoto";
import { marketingImages } from "@/lib/marketing-images";

export default function Hero() {
  const { src, alt } = marketingImages.landingHero;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background pb-20 pt-20 lg:pb-32 lg:pt-32">
      <div
        className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="vs-accent-chip inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              The Intelligence Layer
            </div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              Navigating Tech Careers in{" "}
              <span className="text-primary underline decoration-primary/30 decoration-4 underline-offset-4 sm:decoration-8 sm:underline-offset-8">
                Ethiopia.
              </span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Data-driven career guidance for the next generation of Ethiopian
              tech leaders. Bridge the gap between education and global
              employability.
            </p>

            <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 w-full rounded-md px-8 font-semibold sm:w-auto"
              >
                <Link href="/register" className="flex w-full justify-center">
                  Join the Beta <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-md border-primary/25 px-8 font-semibold text-primary hover:bg-primary/5 sm:w-auto"
                asChild
              >
                <Link href="/market-insight">Explore Trends</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-135 lg:mr-0">
            <div
              className="absolute -inset-4 rounded-xl bg-linear-to-tr from-primary/15 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border shadow-sm">
              <MarketingPhoto src={src} alt={alt} priority className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

