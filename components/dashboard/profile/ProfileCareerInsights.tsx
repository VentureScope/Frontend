"use client";

import CareerReadinessPanel from "@/components/dashboard/CareerReadinessPanel";
import AICallout from "@/components/dashboard/profile/AICallout";
import { useUserReadiness } from "@/hooks/useUserReadiness";

export default function ProfileCareerInsights() {
  const { readiness, loading, refreshing, error, refresh } = useUserReadiness();

  return (
    <div className="min-w-0 space-y-6">
      <CareerReadinessPanel
        readiness={readiness}
        loading={loading}
        refreshing={refreshing}
        error={error}
        onRefresh={() => void refresh()}
        variant="full"
      />
      <AICallout readiness={readiness} loading={loading} />
    </div>
  );
}
