"use client";

import dynamic from "next/dynamic";
import { MarketTrendsPageSkeleton } from "@/components/market/MarketTrendsPageSkeleton";

const MarketTrendsDashboard = dynamic(
  () => import("@/components/market/MarketTrendsDashboard"),
  {
    ssr: false,
    loading: () => <MarketTrendsPageSkeleton />,
  },
);

export default function MarketTrendsPage() {
  return <MarketTrendsDashboard />;
}
