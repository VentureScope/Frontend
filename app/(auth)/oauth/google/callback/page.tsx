"use client"; import { Suspense } from "react";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  buildAuthSessionData,
  completeGoogleOAuthCallback,
  getApiErrorMessage,
} from "@/lib/auth-api";
import { mfaGetAAL } from "@/lib/mfa-api";
import { useAppStore } from "@/store/useAppStore";

const GOOGLE_OAUTH_SESSION_KEY = "google_oauth_tx";
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

function readStoredOAuthState(): { state: string; createdAt: number } | null {
  const raw = sessionStorage.getItem(GOOGLE_OAUTH_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      state?: unknown;
      createdAt?: unknown;
    };

    if (typeof parsed.state !== "string") {
      return null;
    }

    if (typeof parsed.createdAt !== "number") {
      return null;
    }

    return {
      state: parsed.state,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}

function GoogleOAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthData = useAppStore((state) => state.setAuthData);
  const hasProcessedCallbackRef = useRef(false);
  const [statusMessage, setStatusMessage] = useState(
    "Completing Google sign in...",
  );

  useEffect(() => {
    if (hasProcessedCallbackRef.current) {
      return;
    }

    hasProcessedCallbackRef.current = true;
    console.log("[oauth] Handling Google callback");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (error) {
      console.log("[oauth] Callback contains provider error", {
        error,
        errorDescription,
      });
      setStatusMessage(
        errorDescription || "Google sign in was canceled or failed.",
      );
      return;
    }

    if (!code || !state) {
      setStatusMessage(
        "Missing OAuth parameters. Please try signing in again.",
      );
      return;
    }

    const oauthCode = code;
    const oauthState = state;

    const storedState = readStoredOAuthState();
    if (!storedState || storedState.state !== state) {
      sessionStorage.removeItem(GOOGLE_OAUTH_SESSION_KEY);
      console.log("[oauth] State validation failed", {
        hasStoredState: Boolean(storedState),
      });
      setStatusMessage("State validation failed. Please try signing in again.");
      return;
    }

    const now = Date.now();
    if (now - storedState.createdAt > OAUTH_STATE_TTL_MS) {
      console.log("[oauth] Stored OAuth state has expired");
      sessionStorage.removeItem(GOOGLE_OAUTH_SESSION_KEY);
      setStatusMessage("Your sign-in session expired. Please try again.");
      return;
    }

    sessionStorage.removeItem(GOOGLE_OAUTH_SESSION_KEY);

    async function exchangeCode() {
      try {
        console.log("[oauth] Requesting token exchange", {
          endpoint: "/api/auth/oauth/google/callback",
        });
        const authResult = await completeGoogleOAuthCallback(
          oauthCode,
          oauthState,
        );
        const authSessionData = await buildAuthSessionData(authResult);
        setAuthData(authSessionData);
        console.log("[oauth] Google sign-in completed");

        // Critical: check AAL before redirecting — OAuth users with MFA
        // enrolled must complete the challenge here, not just on the login page.
        try {
          const aal = await mfaGetAAL();
          if (aal.current_level === "aal1" && aal.next_level === "aal2") {
            router.replace("/mfa-challenge?redirect=/");
            return;
          }
        } catch {
          // AAL check failure is non-fatal
        }

        router.replace("/");
      } catch (exchangeError) {
        console.log("[oauth] Token exchange failed", { exchangeError });
        setStatusMessage(getApiErrorMessage(exchangeError));
      }
    }

    exchangeCode();
  }, [router, searchParams, setAuthData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">Google Sign-In</h1>
        <p className="mt-3 text-sm text-muted-foreground">{statusMessage}</p>
      </div>
    </div>
  );
}

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>}>
      <GoogleOAuthCallbackContent />
    </Suspense>
  );
}
