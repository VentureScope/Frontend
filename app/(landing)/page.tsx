import { preload } from "react-dom";
import Hero from "@/components/landing/Hero";
import BridgingTheGap from "@/components/landing/BridgingTheGap";
import MarketPulse from "@/components/landing/MarketPulse";
import CTASection from "@/components/landing/CTASection";
import { marketingImages } from "@/lib/marketing-images";

export default function LandingPage() {
  preload(marketingImages.landingHero.src, {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <div className="space-y-0">
      <Hero />
      <BridgingTheGap />
      <MarketPulse />
      <CTASection />
    </div>
  );
}
