import { HeroContent } from "@/components/landing/HeroContent";
import { HeroVisual } from "@/components/landing/HeroVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background pb-20 pt-20 lg:pb-32 lg:pt-32">
      <div
        className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <HeroContent />
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
