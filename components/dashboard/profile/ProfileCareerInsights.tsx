"use client";

import CareerReadinessPanel from "@/components/dashboard/CareerReadinessPanel";
import AICallout from "@/components/dashboard/profile/AICallout";
import type { UserReadiness } from "@/types/readiness";

type ProfileCareerInsightsProps = {
  readiness: UserReadiness | null;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;
  onRefresh?: () => void;
};

export default function ProfileCareerInsights({
  readiness,
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
}: ProfileCareerInsightsProps) {
  return (
    <div className="min-w-0 space-y-6">
      <CareerReadinessPanel
        readiness={readiness}
        loading={loading}
        refreshing={refreshing}
        error={error}
        onRefresh={onRefresh}
        variant="full"
      />
      <AICallout readiness={readiness} loading={loading} />
    </div>
  );
}
