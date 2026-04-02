import Hero from "@/components/landing/Hero";
import BridgingTheGap from "@/components/landing/BridgingTheGap";
import MarketPulse from "@/components/landing/MarketPulse";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="space-y-0">
      <Hero />
      <BridgingTheGap />
      <MarketPulse />
      <CTASection />
    </div>
  );
}
