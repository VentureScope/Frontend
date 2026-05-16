import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MarketingPhoto } from "@/components/landing/MarketingPhoto";
import { marketingImages } from "@/lib/marketing-images";

export default function Hero() {
  const { src, alt } = marketingImages.landingHero;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background pb-20 pt-20 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30">
              <Sparkles className="h-3 w-3" />
              The Intelligence Layer
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
              Navigating Tech Careers in{" "}
              <span className="text-primary underline decoration-primary/30 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">
                Ethiopia.
              </span>
            </h1>

            <p className="max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground">
              Data-driven career guidance for the next generation of Ethiopian
              tech leaders. Bridge the gap between education and global
              employability.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 w-full sm:w-auto rounded-full bg-primary px-8 font-bold hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Link href="/register" className="flex justify-center w-full">
                  Join the Beta <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 w-full sm:w-auto rounded-full bg-primary/10 px-8 font-bold text-primary hover:bg-primary/15"
                asChild
              >
                <Link href="/market-insight">Explore Trends</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-135 lg:mr-0">
            <div
              className="absolute -inset-4 rounded-[40px] bg-linear-to-tr from-primary/20 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-square overflow-hidden rounded-[32px] border-4 border-background shadow-2xl">
              <MarketingPhoto src={src} alt={alt} priority className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
