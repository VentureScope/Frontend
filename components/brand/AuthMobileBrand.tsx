import { VentureScopeBrandLockup } from "@/components/brand/VentureScopeBrandLockup";

/** Compact brand lockup for auth pages on viewports where the left panel is hidden. */
export function AuthMobileBrand() {
  return (
    <div className="mb-6 flex justify-center lg:hidden">
      <VentureScopeBrandLockup
        size={28}
        href="/"
        wordmarkClassName="text-lg"
      />
    </div>
  );
}
