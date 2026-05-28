import type { MFAALResponse } from "@/types/mfa";
import { mfaGetAAL } from "@/lib/mfa-api";

const TTL_MS = 5 * 60_000;

let cache: { value: MFAALResponse; fetchedAt: number } | null = null;
let inFlight: Promise<MFAALResponse> | null = null;

export function clearMfaAalCache(): void {
  cache = null;
  inFlight = null;
}

/** Cached MFA AAL check (in-memory only; not persisted). */
export async function getMfaAalCached(): Promise<MFAALResponse> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return cache.value;
  }

  if (inFlight) {
    return inFlight;
  }

  inFlight = mfaGetAAL()
    .then((value) => {
      cache = { value, fetchedAt: Date.now() };
      return value;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}
