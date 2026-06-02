import { MarketingPhoto } from "@/components/landing/MarketingPhoto";
import { marketingImages } from "@/lib/marketing-images";

export function HeroVisual() {
  const { src, alt } = marketingImages.landingHero;

  return (
    <div className="relative mx-auto w-full max-w-135 lg:mr-0">
      <div
        className="absolute -inset-4 rounded-xl bg-linear-to-tr from-primary/15 to-transparent blur-2xl"
        aria-hidden
      />
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border shadow-sm dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.65)]">
        <MarketingPhoto
          src={src}
          alt={alt}
          priority
          fetchPriority="high"
          className="object-cover dark:brightness-[0.88] dark:saturate-[0.92]"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0)] dark:opacity-100 dark:shadow-[inset_0_0_72px_28px_rgba(0,0,0,0.55)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-t from-background/75 via-background/25 to-transparent opacity-0 dark:opacity-100"
          aria-hidden
        />
      </div>
    </div>
  );
}
