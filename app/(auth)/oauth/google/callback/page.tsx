"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  buildAuthSessionData,
  completeGoogleOAuthCallback,
  getApiErrorMessage,
} from "@/lib/auth-api";
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

export default function GoogleOAuthCallbackPage() {
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
        router.replace("/");
      } catch (exchangeError) {
        console.log("[oauth] Token exchange failed", { exchangeError });
        setStatusMessage(getApiErrorMessage(exchangeError));
      }
    }

    exchangeCode();
  }, [router, searchParams, setAuthData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Google Sign-In</h1>
        <p className="mt-3 text-sm text-slate-600">{statusMessage}</p>
      </div>
    </div>
  );
}
